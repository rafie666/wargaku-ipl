const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const SERVER_URL = process.env.SERVER_URL || `http://103.134.221.201:${PORT}`;

// 1. PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || '103.134.221.200',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '9c66f3bdce2fc90461a2f510628f3daa',
  database: process.env.DB_NAME || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DB POOL ERROR]', err.message);
});

// 2. Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const bucket = req.body.bucket || req.query.bucket || 'bukti-transfer';
    const targetDir = path.join(UPLOADS_DIR, bucket);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${baseName}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

// Allowed tables whitelist for security
const ALLOWED_TABLES = new Set([
  'wargaku_config',
  'wargaku_jenis_iuran',
  'wargaku_warga',
  'wargaku_tagihan',
  'wargaku_kas',
  'wargaku_events',
  'wargaku_tagihan_events',
  'wargaku_rts',
  'wargaku_rws',
  'wargaku_users',
  'wargaku_pengaduan',
  'wargaku_surat',
  'wargaku_kontak_darurat',
  'wargaku_bank_accounts',
  'wargaku_qris_accounts',
  'wargaku_notifications',
  'wargaku_audit_logs',
  'wargaku_moota_mutations',
  'wargaku_jadwal_satpam',
  'wargaku_petugas_satpam',
  'wargaku_admin_auth'
]);

function validateTable(tableName) {
  if (!ALLOWED_TABLES.has(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  return tableName;
}

// 3. Health Endpoint
app.get('/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() AS now');
    res.json({
      status: 'ok',
      time: dbRes.rows[0].now,
      database: 'connected (Server 1)',
      service: 'wargaku-native-api (Server 2)'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 4. Batch Sync Endpoint (loads all initial data in 1 request)
app.get('/api/sync', async (req, res) => {
  try {
    const tables = Array.from(ALLOWED_TABLES);
    const queries = tables.map((t) => pool.query(`SELECT id, data, updated_at FROM public.${t}`));
    const results = await Promise.all(queries);

    const payload = {};
    tables.forEach((tableName, index) => {
      payload[tableName] = results[index].rows;
    });

    res.json({ success: true, data: payload });
  } catch (err) {
    console.error('[SYNC ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Query Table Data (supports PostgREST style query params or standard)
app.get('/api/data/:table', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    const { id, select, order } = req.query;

    let queryText = `SELECT id, data, updated_at FROM public.${tableName}`;
    const params = [];

    // Filter by id
    if (id) {
      if (id.startsWith('eq.')) {
        params.push(id.substring(3));
        queryText += ` WHERE id = $${params.length}`;
      } else if (id.startsWith('in.(') && id.endsWith(')')) {
        const ids = id.substring(4, id.length - 1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        params.push(ids);
        queryText += ` WHERE id = ANY($${params.length}::text[])`;
      } else {
        params.push(id);
        queryText += ` WHERE id = $${params.length}`;
      }
    }

    queryText += ` ORDER BY updated_at DESC`;

    const { rows } = await pool.query(queryText, params);
    res.json(rows);
  } catch (err) {
    console.error(`[GET /api/data/${req.params.table}]`, err.message);
    res.status(400).json({ error: err.message });
  }
});

// 6. Upsert Data (Single row or Array of rows)
app.post('/api/data/:table/upsert', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    let items = req.body;

    if (!items) {
      return res.status(400).json({ error: 'No data provided' });
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    if (items.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const upsertQuery = `
        INSERT INTO public.${tableName} (id, data, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW()
        RETURNING id, data, updated_at;
      `;

      const results = [];
      for (const item of items) {
        // item might be { id, data } or raw item with item.id
        const rowId = item.id || (item.data && item.data.id) || `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const rowData = item.data !== undefined ? item.data : item;
        const { rows } = await client.query(upsertQuery, [String(rowId), JSON.stringify(rowData)]);
        results.push(rows[0]);
      }
      await client.query('COMMIT');
      res.json({ success: true, count: results.length, data: results });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`[POST /api/data/${req.params.table}/upsert]`, err.message);
    res.status(400).json({ error: err.message });
  }
});

// PostgREST compatibility alias: POST /rest/v1/:table or POST /api/data/:table
app.post('/api/data/:table', async (req, res) => {
  return app._router.handle(
    Object.assign(req, { url: `/api/data/${req.params.table}/upsert` }),
    res
  );
});

// 7. Delete Row(s)
app.delete('/api/data/:table/:id', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    const { id } = req.params;
    await pool.query(`DELETE FROM public.${tableName} WHERE id = $1`, [id]);
    res.json({ success: true, deleted: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/data/:table', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Query parameter ?id= required' });
    }

    if (id.startsWith('eq.')) {
      const targetId = id.substring(3);
      await pool.query(`DELETE FROM public.${tableName} WHERE id = $1`, [targetId]);
      return res.json({ success: true, deleted: targetId });
    }

    if (id.startsWith('in.(') && id.endsWith(')')) {
      const ids = id.substring(4, id.length - 1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
      await pool.query(`DELETE FROM public.${tableName} WHERE id = ANY($1::text[])`, [ids]);
      return res.json({ success: true, deletedCount: ids.length });
    }

    await pool.query(`DELETE FROM public.${tableName} WHERE id = $1`, [id]);
    res.json({ success: true, deleted: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Upload File (Base64 or Multipart)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const bucket = req.body.bucket || req.query.bucket || 'bukti-transfer';
    const bucketDir = path.join(UPLOADS_DIR, bucket);
    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir, { recursive: true });
    }

    // A. If uploaded as multipart file
    if (req.file) {
      const publicUrl = `${SERVER_URL}/uploads/${bucket}/${req.file.filename}`;
      return res.json({
        success: true,
        publicUrl,
        filename: req.file.filename,
        bucket
      });
    }

    // B. If uploaded as JSON with Base64 payload
    const { base64, path: customPath, contentType } = req.body;
    if (!base64) {
      return res.status(400).json({ success: false, error: 'No file or base64 data provided' });
    }

    const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '').replace(/[\r\n\t ]/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const ext = contentType ? `.${contentType.split('/')[1] || 'jpg'}` : '.jpg';
    const fileName = customPath ? path.basename(customPath) : `upload_${Date.now()}${ext}`;
    const filePath = path.join(bucketDir, fileName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `${SERVER_URL}/uploads/${bucket}/${fileName}`;

    res.json({
      success: true,
      publicUrl,
      filename: fileName,
      bucket
    });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Manual Auto-Billing Trigger
app.post('/api/billing/check', async (req, res) => {
  try {
    const result = await pool.query('SELECT fn_check_and_run_auto_billing() AS summary');
    res.json({ success: true, result: result.rows[0].summary });
  } catch (err) {
    console.error('[BILLING TRIGGER ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Automated Cron: Auto-Billing Asia/Jakarta
// Runs every hour at minute 5 to ensure new monthly invoices are generated automatically
cron.schedule('5 * * * *', async () => {
  try {
    console.log('[CRON] Running automatic billing check (Asia/Jakarta)...');
    const result = await pool.query('SELECT fn_check_and_run_auto_billing() AS summary');
    console.log('[CRON RESULT]', result.rows[0]?.summary);
  } catch (err) {
    console.error('[CRON ERROR]', err.message);
  }
}, {
  timezone: 'Asia/Jakarta'
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 WARGAKU REST API SERVER ONLINE`);
  console.log(`📡 URL: http://0.0.0.0:${PORT}`);
  console.log(`🗄️  Connected to DB: ${process.env.DB_HOST || '103.134.221.200'}:5432`);
  console.log(`⏰ Cron: Auto-billing check hourly Asia/Jakarta`);
  console.log(`===============================================`);
});

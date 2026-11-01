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
function getServerUrl(req) {
  if (req && req.headers && req.headers['x-forwarded-host']) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    return `${proto}://${req.headers['x-forwarded-host']}`;
  }
  return process.env.SERVER_URL || 'https://api-warga.glosindo.net.id';
}
const SERVER_URL = process.env.SERVER_URL || 'https://api-warga.glosindo.net.id';

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
  // Core tables
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
  'wargaku_admin_auth',
  'wargaku_kompleks',
  'wargaku_residents',
  'wargaku_rt',
  'wargaku_rw',
  'wargaku_emergency_contacts',

  // Admin Features Tables (20261028)
  'pos_iuran',
  'wargaku_pos_iuran',
  'rekening_bank',
  'wargaku_rekening_bank',
  'template_surat',
  'wargaku_template_surat',
  'komplek_metadata',
  'wargaku_komplek_metadata',
  'platform_announcements',
  'wargaku_platform_announcements',
  'support_tickets',
  'wargaku_support_tickets',
  'activity_logs',
  'wargaku_activity_logs',

  // Aliases & Views
  'kompleks',
  'users',
  'warga',
  'tagihan',
  'kas'
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

// 4. Batch Sync Endpoint
app.get('/api/sync', async (req, res) => {
  try {
    const komplekId = req.query.komplek_id;
    const syncTables = [
      'wargaku_config', 'wargaku_jenis_iuran', 'wargaku_warga',
      'wargaku_tagihan', 'wargaku_kas', 'wargaku_events',
      'wargaku_tagihan_events', 'wargaku_rts', 'wargaku_rws',
      'wargaku_users', 'wargaku_pengaduan', 'wargaku_surat',
      'wargaku_kontak_darurat', 'wargaku_bank_accounts', 'wargaku_qris_accounts',
      'wargaku_notifications', 'wargaku_audit_logs', 'wargaku_kompleks',
      'pos_iuran', 'rekening_bank', 'template_surat', 'komplek_metadata'
    ];

    const queries = syncTables.map(async (t) => {
      try {
        let q = `SELECT * FROM public.${t}`;
        if (t === 'wargaku_kompleks' || t === 'komplek_metadata') {
          q += ` ORDER BY 1 DESC`;
          const r = await pool.query(q);
          return r.rows;
        }
        if (komplekId) {
          q += ` WHERE (komplek_id = $1 OR data->>'komplek_id' = $1 OR data->>'komplek_id' IS NULL) ORDER BY 1 DESC`;
          const r = await pool.query(q, [komplekId]);
          return r.rows;
        }
        q += ` ORDER BY 1 DESC`;
        const r = await pool.query(q);
        return r.rows;
      } catch (err) {
        console.warn(`[SYNC WARN] ${t}:`, err.message);
        return [];
      }
    });

    const results = await Promise.all(queries);

    const payload = {};
    syncTables.forEach((tableName, index) => {
      payload[tableName] = results[index].map((r) => (r.data === undefined ? { ...r, data: { ...r } } : r));
    });

    res.json({ success: true, data: payload });
  } catch (err) {
    console.error('[SYNC ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Query Table Data
app.get('/api/data/:table', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    const { select, order, limit, offset, ...filterParams } = req.query;

    let whereClauses = [];
    const params = [];

    const formatCol = (col) => {
      if (col.includes('->>')) {
        const parts = col.split('->>');
        return `(${parts[0].replace(/[^a-zA-Z0-9_]/g, '')}->>'${parts[1].replace(/[^a-zA-Z0-9_]/g, '')}')`;
      }
      if (col.includes('->')) {
        const parts = col.split('->');
        return `(${parts[0].replace(/[^a-zA-Z0-9_]/g, '')}->'${parts[1].replace(/[^a-zA-Z0-9_]/g, '')}')`;
      }
      return `"${col.replace(/[^a-zA-Z0-9_]/g, '')}"`;
    };

    for (const [key, val] of Object.entries(filterParams)) {
      if (typeof val !== 'string') continue;

      if (val.startsWith('eq.')) {
        params.push(val.substring(3));
        whereClauses.push(`${formatCol(key)} = $${params.length}`);
      } else if (val.startsWith('neq.')) {
        params.push(val.substring(4));
        whereClauses.push(`${formatCol(key)} != $${params.length}`);
      } else if (val.startsWith('in.(') && val.endsWith(')')) {
        const ids = val.substring(4, val.length - 1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        params.push(ids);
        whereClauses.push(`${formatCol(key)} = ANY($${params.length}::text[])`);
      } else if (val.startsWith('is.')) {
        const nullVal = val.substring(3).toLowerCase();
        if (nullVal === 'null') {
          whereClauses.push(`${formatCol(key)} IS NULL`);
        } else if (nullVal === 'not.null') {
          whereClauses.push(`${formatCol(key)} IS NOT NULL`);
        }
      } else {
        params.push(val);
        whereClauses.push(`${formatCol(key)} = $${params.length}`);
      }
    }

    let queryText = `SELECT * FROM public.${tableName}`;
    if (whereClauses.length > 0) {
      queryText += ` WHERE ` + whereClauses.join(' AND ');
    }

    if (order && typeof order === 'string') {
      const orderParts = order.split('.');
      const orderCol = formatCol(orderParts[0]);
      const orderDir = (orderParts[1] || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      queryText += ` ORDER BY ${orderCol} ${orderDir}`;
    } else {
      queryText += ` ORDER BY 1 DESC`;
    }

    if (limit && !isNaN(parseInt(limit, 10))) {
      params.push(parseInt(limit, 10));
      queryText += ` LIMIT $${params.length}`;
    }
    if (offset && !isNaN(parseInt(offset, 10))) {
      params.push(parseInt(offset, 10));
      queryText += ` OFFSET $${params.length}`;
    }

    const { rows } = await pool.query(queryText, params);

    const normalizedRows = rows.map((r) => {
      if (r.data === undefined) {
        return { ...r, data: { ...r } };
      }
      return r;
    });

    res.json(normalizedRows);
  } catch (err) {
    console.error(`[GET /api/data/${req.params.table}]`, err.message);
    res.status(400).json({ error: err.message });
  }
});

// 6. Upsert Data
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

      const TABLES_WITH_KOMPLEK_COL = new Set([
        'pos_iuran', 'wargaku_pos_iuran',
        'rekening_bank', 'wargaku_rekening_bank',
        'template_surat', 'wargaku_template_surat',
        'komplek_metadata', 'wargaku_komplek_metadata',
        'support_tickets', 'wargaku_support_tickets',
        'activity_logs', 'wargaku_activity_logs'
      ]);

      const results = [];
      for (const item of items) {
        const rowId = item.id || (item.data && item.data.id) || `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        let rowData = item.data !== undefined ? item.data : item;

        if (TABLES_WITH_KOMPLEK_COL.has(tableName)) {
          const kId = item.komplek_id || (item.data && item.data.komplek_id) || req.query.komplek_id || rowData.komplek_id || '76bf56cc-bafb-4d06-a701-62a520bce398';
          const upsertSql = `
            INSERT INTO public.${tableName} (id, komplek_id, data, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (id) DO UPDATE
            SET komplek_id = EXCLUDED.komplek_id, data = EXCLUDED.data, updated_at = NOW()
            RETURNING *;
          `;
          const { rows } = await client.query(upsertSql, [String(rowId), kId, JSON.stringify(rowData)]);
          results.push(rows[0]);
        } else if (tableName === 'platform_announcements' || tableName === 'wargaku_platform_announcements') {
          const upsertSql = `
            INSERT INTO public.${tableName} (id, data, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
            RETURNING *;
          `;
          const { rows } = await client.query(upsertSql, [String(rowId), JSON.stringify(rowData)]);
          results.push(rows[0]);
        } else {
          // Standard JSONB table
          if (tableName !== 'wargaku_kompleks' && typeof rowData === 'object' && rowData !== null) {
            const tenantId = rowData.komplek_id || req.query.komplek_id || req.headers['x-komplek-id'] || 'komplek-permata-bintaro';
            if (!rowData.komplek_id) {
              rowData = { ...rowData, komplek_id: tenantId };
            }
          }
          const upsertSql = `
            INSERT INTO public.${tableName} (id, data, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
            RETURNING id, data, updated_at;
          `;
          const { rows } = await client.query(upsertSql, [String(rowId), JSON.stringify(rowData)]);
          results.push(rows[0]);
        }
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

// PostgREST compatibility alias
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

// 8. Upload File
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const bucket = req.body.bucket || req.query.bucket || 'bukti-transfer';
    const bucketDir = path.join(UPLOADS_DIR, bucket);
    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir, { recursive: true });
    }

    const currentBaseUrl = getServerUrl(req);
    if (req.file) {
      const publicUrl = `${currentBaseUrl}/uploads/${bucket}/${req.file.filename}`;
      return res.json({
        success: true,
        publicUrl,
        filename: req.file.filename,
        bucket
      });
    }

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
    const publicUrl = `${currentBaseUrl}/uploads/${bucket}/${fileName}`;

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

// 8.5. EXPO UPDATES (OTA) PROTOCOL V1
const FormData = require('form-data');
const crypto = require('crypto');

const UPDATES_DIR = path.join(__dirname, 'updates');
const CURRENT_UPDATE_DIR = path.join(UPDATES_DIR, 'current');

function createHash(buffer, algo, encoding) {
  return crypto.createHash(algo).update(buffer).digest(encoding);
}

function getBase64URLEncoding(base64String) {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function convertSHA256HashToUUID(value) {
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;
}

app.get('/api/manifest', (req, res) => {
  try {
    const protocolVersion = parseInt(req.headers['expo-protocol-version'] || '1', 10);
    const platform = req.headers['expo-platform'] || req.query.platform || 'android';
    const runtimeVersion = req.headers['expo-runtime-version'] || req.query['runtime-version'] || '2.0.0';
    const currentUpdateId = req.headers['expo-current-update-id'];

    const metadataPath = path.join(CURRENT_UPDATE_DIR, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      const form = new FormData();
      form.append('directive', JSON.stringify({ type: 'noUpdateAvailable' }), {
        contentType: 'application/json',
        header: { 'content-type': 'application/json; charset=utf-8' }
      });
      res.writeHead(200, {
        'expo-protocol-version': '1',
        'expo-sfv-version': '0',
        'cache-control': 'private, max-age=0',
        'content-type': `multipart/mixed; boundary=${form.getBoundary()}`
      });
      return form.pipe(res);
    }

    const metadataBuffer = fs.readFileSync(metadataPath);
    const metadata = JSON.parse(metadataBuffer.toString('utf-8'));
    const metadataStat = fs.statSync(metadataPath);
    const updateId = convertSHA256HashToUUID(createHash(metadataBuffer, 'sha256', 'hex'));

    if (currentUpdateId === updateId && protocolVersion === 1) {
      const form = new FormData();
      form.append('directive', JSON.stringify({ type: 'noUpdateAvailable' }), {
        contentType: 'application/json',
        header: { 'content-type': 'application/json; charset=utf-8' }
      });
      res.writeHead(200, {
        'expo-protocol-version': '1',
        'expo-sfv-version': '0',
        'cache-control': 'private, max-age=0',
        'content-type': `multipart/mixed; boundary=${form.getBoundary()}`
      });
      return form.pipe(res);
    }

    const platformMetadata = metadata.fileMetadata && metadata.fileMetadata[platform];
    if (!platformMetadata) {
      return res.status(404).json({ error: `Platform ${platform} not available` });
    }

    const currentBaseUrl = getServerUrl(req);
    const bundleFilePath = path.join(CURRENT_UPDATE_DIR, platformMetadata.bundle);
    if (!fs.existsSync(bundleFilePath)) {
      return res.status(404).json({ error: 'Launch bundle not found' });
    }
    const bundleBuffer = fs.readFileSync(bundleFilePath);
    const launchAsset = {
      hash: getBase64URLEncoding(createHash(bundleBuffer, 'sha256', 'base64')),
      key: createHash(bundleBuffer, 'md5', 'hex'),
      fileExtension: '.bundle',
      contentType: 'application/javascript',
      url: `${currentBaseUrl}/api/updates/assets/${platformMetadata.bundle}`
    };

    const assets = (platformMetadata.assets || []).map(asset => {
      const assetFilePath = path.join(CURRENT_UPDATE_DIR, asset.path);
      const assetBuffer = fs.readFileSync(assetFilePath);
      const ext = asset.ext ? `.${asset.ext}` : '';
      const contentType = ext === '.png' ? 'image/png' : (ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream');
      return {
        hash: getBase64URLEncoding(createHash(assetBuffer, 'sha256', 'base64')),
        key: createHash(assetBuffer, 'md5', 'hex'),
        fileExtension: ext,
        contentType,
        url: `${currentBaseUrl}/api/updates/assets/${asset.path}`
      };
    });

    const manifest = {
      id: updateId,
      createdAt: metadataStat.birthtime.toISOString(),
      runtimeVersion: runtimeVersion,
      assets,
      launchAsset,
      metadata: {},
      extra: {
        expoClient: {
          name: "IPL Warga",
          slug: "ipl-warga-mobile",
          version: "2.0.0"
        }
      }
    };

    const form = new FormData();
    form.append('manifest', JSON.stringify(manifest), {
      contentType: 'application/json',
      header: { 'content-type': 'application/json; charset=utf-8' }
    });
    form.append('extensions', JSON.stringify({ assetRequestHeaders: {} }), {
      contentType: 'application/json'
    });

    res.writeHead(200, {
      'expo-protocol-version': '1',
      'expo-sfv-version': '0',
      'cache-control': 'private, max-age=0',
      'content-type': `multipart/mixed; boundary=${form.getBoundary()}`
    });
    form.pipe(res);
  } catch (err) {
    console.error('[MANIFEST ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/updates/assets/*', (req, res) => {
  try {
    const relPath = req.params[0];
    const fullPath = path.resolve(CURRENT_UPDATE_DIR, relPath);
    if (!fullPath.startsWith(CURRENT_UPDATE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: `Asset not found: ${relPath}` });
    }

    if (relPath.endsWith('.hbc') || relPath.endsWith('.bundle')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (relPath.endsWith('.png') || relPath.startsWith('assets/')) {
      res.setHeader('Content-Type', 'image/png');
    }

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(fullPath);
  } catch (err) {
    console.error('[ASSET ERROR]', err);
    res.status(500).json({ error: err.message });
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

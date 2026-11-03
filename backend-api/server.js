const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const crypto = require('crypto');
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
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf ? buf.toString('utf8') : '';
  }
}));
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
  'feature_flags',
  'wargaku_feature_flags',
  'system_configs',
  'wargaku_system_configs',
  'reset_requests',

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
      } else if (val.startsWith('gte.')) {
        params.push(val.substring(4));
        whereClauses.push(`${formatCol(key)} >= $${params.length}`);
      } else if (val.startsWith('gt.')) {
        params.push(val.substring(3));
        whereClauses.push(`${formatCol(key)} > $${params.length}`);
      } else if (val.startsWith('lte.')) {
        params.push(val.substring(4));
        whereClauses.push(`${formatCol(key)} <= $${params.length}`);
      } else if (val.startsWith('lt.')) {
        params.push(val.substring(3));
        whereClauses.push(`${formatCol(key)} < $${params.length}`);
      } else if (val.startsWith('like.')) {
        params.push(val.substring(5));
        whereClauses.push(`${formatCol(key)} LIKE $${params.length}`);
      } else if (val.startsWith('ilike.')) {
        params.push(val.substring(6));
        whereClauses.push(`${formatCol(key)} ILIKE $${params.length}`);
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

// 7b. Patch / Update Record
app.patch('/api/data/:table', async (req, res) => {
  try {
    const tableName = validateTable(req.params.table);
    const body = req.body;
    let targetId = req.query.id;
    if (targetId && targetId.startsWith('eq.')) {
      targetId = targetId.substring(3);
    }
    if (!targetId && body && body.id) {
      targetId = body.id;
    }
    if (!targetId) {
      return res.status(400).json({ error: 'Missing ID for update' });
    }

    const colCheck = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = 'data'`,
      [tableName]
    );

    let updatedRow;
    if (colCheck.rows.length > 0) {
      const updateData = body.data !== undefined ? body.data : body;
      const { rows } = await pool.query(
        `UPDATE public.${tableName} 
         SET data = data || $1::jsonb, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [JSON.stringify(updateData), targetId]
      );
      updatedRow = rows[0];
    } else {
      const entries = Object.entries(body).filter(([k]) => k !== 'id');
      if (entries.length === 0) {
        return res.json({ success: true });
      }
      const setParts = [];
      const params = [];
      for (const [col, val] of entries) {
        params.push(val);
        setParts.push(`"${col}" = $${params.length}`);
      }
      params.push(targetId);
      const q = `UPDATE public.${tableName} SET ${setParts.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;
      const { rows } = await pool.query(q, params);
      updatedRow = rows[0];
    }

    res.json({ success: true, data: updatedRow });
  } catch (err) {
    console.error(`[PATCH /api/data/${req.params.table}]`, err.message);
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


// 11. RPC Endpoint for PostgreSQL Stored Procedures
app.post("/api/rpc/:fn", async (req, res) => {
  const { fn } = req.params;
  const params = req.body || {};
  try {
    if (fn === "provision_new_komplek") {
      const {
        p_komplek_nama,
        p_komplek_alamat,
        p_komplek_kota,
        p_komplek_kode_pos,
        p_admin_name,
        p_admin_phone,
        p_admin_email,
        p_admin_password
      } = params;
      const result = await pool.query(
        "SELECT public.provision_new_komplek($1, $2, $3, $4, $5, $6, $7, $8) AS result",
        [
          p_komplek_nama,
          p_komplek_alamat || "",
          p_komplek_kota || "",
          p_komplek_kode_pos || "",
          p_admin_name,
          p_admin_phone,
          p_admin_email || "",
          p_admin_password
        ]
      );
      return res.json(result.rows[0]?.result || {});
    }

    if (fn === "validate_tenant_relationships") {
      const { p_komplek_id, p_rw_id, p_rt_id } = params;
      const result = await pool.query(
        "SELECT public.validate_tenant_relationships($1, $2, $3) AS result",
        [p_komplek_id, p_rw_id, p_rt_id]
      );
      return res.json(result.rows[0]?.result || false);
    }

    return res.status(404).json({ error: `Unknown RPC function: ${fn}` });
  } catch (err) {
    console.error(`[RPC ${fn} ERROR]`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 12. Moota Webhook Integration (Verifikasi Pembayaran Bank Otomatis)
// ============================================================================

/**
 * Validasi header Signature Moota dengan MOOTA_WEBHOOK_SECRET
 */
function verifyMootaSignature(req) {
  const secret = (process.env.MOOTA_WEBHOOK_SECRET || '').trim();

  // Jika secret belum diisi, izinkan dengan peringatan untuk kemudahan initial setup/testing
  if (!secret || secret === 'isi_secret_dari_atasan') {
    console.warn('[MOOTA WEBHOOK] ⚠️  MOOTA_WEBHOOK_SECRET belum dikonfigurasi di .env! Melewati verifikasi signature (mode permissive).');
    return { valid: true, warning: 'SECRET_NOT_CONFIGURED' };
  }

  const signatureHeader = req.headers['signature'] ||
                          req.headers['x-moota-signature'] ||
                          req.headers['authorization'];

  if (!signatureHeader) {
    return { valid: false, reason: 'Header Signature tidak ditemukan pada request.' };
  }

  const cleanSignature = signatureHeader.replace(/^Bearer\s+/i, '').trim();

  // 1. Cek kecocokan token langsung (direct token)
  if (cleanSignature === secret) {
    return { valid: true, method: 'direct_token' };
  }

  // 2. Cek HMAC-SHA256 dari raw payload
  const rawPayload = req.rawBody || JSON.stringify(req.body);
  const calculatedHmac = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');

  if (calculatedHmac.toLowerCase() === cleanSignature.toLowerCase()) {
    return { valid: true, method: 'hmac_sha256' };
  }

  // 3. Fallback: HMAC-SHA256 dari JSON.stringify(req.body) jika rawBody berbeda format
  const fallbackHmac = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  if (fallbackHmac.toLowerCase() === cleanSignature.toLowerCase()) {
    return { valid: true, method: 'hmac_sha256_fallback' };
  }

  return {
    valid: false,
    reason: `Signature mismatch. Diterima: ${cleanSignature.substring(0, 10)}..., Dihitung: ${calculatedHmac.substring(0, 10)}...`
  };
}

/**
 * Pemrosesan mutasi bank dari Moota di latar belakang (asynchronous)
 */
async function processMootaMutations(mutations) {
  if (!Array.isArray(mutations)) {
    mutations = [mutations];
  }

  for (const item of mutations) {
    try {
      if (!item || typeof item !== 'object') continue;

      const mutationId = String(item.id || item.mutation_id || `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
      const rawAmount = item.amount || item.nominal || 0;
      const amount = Math.round(Number(rawAmount));
      const type = (item.type || 'CR').toUpperCase(); // CR = Credit / Uang Masuk, DB = Debit / Uang Keluar
      const description = item.description || item.keterangan || item.note || '';
      const date = item.date || new Date().toISOString();
      const accountNumber = item.account_number || item.bank_id || '';

      console.log(`[MOOTA MUTATION] ID: ${mutationId} | Tipe: ${type} | Nominal: Rp ${amount.toLocaleString('id-ID')} | Berita: "${description}"`);

      // 1. Simpan ke wargaku_moota_mutations (mencegah double-processing)
      const existing = await pool.query(
        'SELECT id FROM public.wargaku_moota_mutations WHERE id = $1',
        [mutationId]
      );

      if (existing.rows.length > 0) {
        console.log(`[MOOTA MUTATION] Mutasi ${mutationId} sudah pernah diproses. Lewati.`);
        continue;
      }

      await pool.query(
        `INSERT INTO public.wargaku_moota_mutations (id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [mutationId, JSON.stringify({ ...item, processed_at: new Date().toISOString() })]
      );

      // Hanya proses mutasi uang masuk (Credit) dengan nominal > 0
      if (type !== 'CR' || amount <= 0) {
        console.log(`[MOOTA MUTATION] Tipe bukan CR (uang masuk), tidak diproses ke tagihan.`);
        continue;
      }

      // 2. Cari tagihan belum lunas yang cocok
      let matchedBill = null;
      let matchedSource = null; // 'wargaku_tagihan' atau 'wargaku_tagihan_events'

      // A. Cek di tabel wargaku_tagihan
      try {
        const pendingBills = await pool.query(
          `SELECT id, komplek_id, resident_id, periode, total_amount, status
           FROM public.wargaku_tagihan
           WHERE status NOT IN ('Lunas', 'lunas', 'PAID', 'paid')
           ORDER BY created_at DESC LIMIT 100`
        );

        for (const bill of pendingBills.rows) {
          const billTotal = Math.round(Number(bill.total_amount || 0));
          if (billTotal === amount) {
            matchedBill = bill;
            matchedSource = 'wargaku_tagihan';
            console.log(`[MOOTA MATCH] Tagihan cocok exact nominal: Bill ID ${bill.id} (Rp ${billTotal})`);
            break;
          }
          // Toleransi kode unik 3 digit (1-999)
          const diff = amount - billTotal;
          if (diff > 0 && diff < 1000) {
            matchedBill = bill;
            matchedSource = 'wargaku_tagihan';
            console.log(`[MOOTA MATCH] Tagihan cocok kode unik (+${diff}): Bill ID ${bill.id}`);
            break;
          }
        }
      } catch (errTagihan) {
        console.warn('[MOOTA CHECK TAGIHAN WARN]', errTagihan.message);
      }

      // B. Fallback: Cek di wargaku_tagihan_events (jika menggunakan JSONB storage)
      if (!matchedBill) {
        try {
          const eventBills = await pool.query(
            `SELECT id, data FROM public.wargaku_tagihan_events
             WHERE (data->>'status' NOT IN ('Lunas', 'lunas', 'PAID', 'paid') OR data->>'status' IS NULL)
             ORDER BY updated_at DESC LIMIT 100`
          );

          for (const ev of eventBills.rows) {
            const evData = ev.data || {};
            const evTotal = Math.round(Number(evData.total || evData.total_amount || 0));
            if (evTotal === amount) {
              matchedBill = { ...evData, id: ev.id };
              matchedSource = 'wargaku_tagihan_events';
              console.log(`[MOOTA MATCH] Tagihan event cocok exact: ID ${ev.id}`);
              break;
            }
            const diff = amount - evTotal;
            if (diff > 0 && diff < 1000) {
              matchedBill = { ...evData, id: ev.id };
              matchedSource = 'wargaku_tagihan_events';
              console.log(`[MOOTA MATCH] Tagihan event cocok kode unik (+${diff}): ID ${ev.id}`);
              break;
            }
          }
        } catch (errEv) {
          console.warn('[MOOTA CHECK EVENT WARN]', errEv.message);
        }
      }

      // 3. Eksekusi pelunasan jika tagihan ditemukan
      if (matchedBill) {
        const paymentEvidence = {
          source: 'moota_webhook',
          mutation_id: mutationId,
          bank_account: accountNumber,
          amount: amount,
          description: description,
          transaction_date: date,
          verified_auto: true,
          verified_at: new Date().toISOString()
        };

        if (matchedSource === 'wargaku_tagihan') {
          await pool.query(
            `UPDATE public.wargaku_tagihan
             SET status = 'Lunas',
                 verified_at = NOW(),
                 payment_evidence = $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [JSON.stringify(paymentEvidence), matchedBill.id]
          );
        } else if (matchedSource === 'wargaku_tagihan_events') {
          const updatedData = {
            ...matchedBill,
            status: 'Lunas',
            verified_at: new Date().toISOString(),
            payment_evidence: paymentEvidence
          };
          await pool.query(
            `UPDATE public.wargaku_tagihan_events
             SET data = $1, updated_at = NOW()
             WHERE id = $2`,
            [JSON.stringify(updatedData), matchedBill.id]
          );
        }

        console.log(`[MOOTA SUCCESS] ✅ Tagihan ID ${matchedBill.id} sukses LUNAS via Moota!`);

        // 4. Catat otomatis ke buku kas masuk (wargaku_kas)
        try {
          const kasId = crypto.randomUUID();
          const komplekId = matchedBill.komplek_id || '76bf56cc-bafb-4d06-a701-62a520bce398';
          await pool.query(
            `INSERT INTO public.wargaku_kas (id, komplek_id, tanggal, tipe, kategori, nominal, keterangan, created_at)
             VALUES ($1, $2, CURRENT_DATE, 'masuk', 'IPL', $3, $4, NOW())`,
            [
              kasId,
              komplekId,
              amount,
              `Pembayaran Otomatis Moota: Tagihan Periode ${matchedBill.periode || ''} (ID Mutasi: ${mutationId}, Rekening: ${accountNumber})`
            ]
          );
          console.log(`[MOOTA KAS] ✅ Kas masuk tercatat otomatis Rp ${amount}`);
        } catch (kasErr) {
          console.warn('[MOOTA KAS WARN]', kasErr.message);
        }

        // 5. Buat notifikasi warga otomatis
        try {
          const notifId = `notif-moota-${Date.now()}`;
          const komplekId = matchedBill.komplek_id || '76bf56cc-bafb-4d06-a701-62a520bce398';
          const notifData = {
            id: notifId,
            komplek_id: komplekId,
            recipient_id: matchedBill.resident_id || matchedBill.wargaId,
            title: 'Pembayaran IPL Terverifikasi Otomatis',
            message: `Pembayaran iuran IPL sebesar Rp ${amount.toLocaleString('id-ID')} telah berhasil diterima dan diverifikasi secara otomatis oleh sistem perbankan.`,
            type: 'PAYMENT_SUCCESS',
            tagihan_id: matchedBill.id,
            read: false,
            created_at: new Date().toISOString()
          };
          await pool.query(
            `INSERT INTO public.wargaku_notifications (id, data, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
            [notifId, JSON.stringify(notifData)]
          );
          console.log(`[MOOTA NOTIF] ✅ Notifikasi pembayaran sukses dibuat.`);
        } catch (notifErr) {
          console.warn('[MOOTA NOTIF WARN]', notifErr.message);
        }
      } else {
        console.log(`[MOOTA UNMATCHED] Mutasi Rp ${amount} (${description}) tidak cocok dengan tagihan pending manapun. Disimpan di arsip mutasi.`);
      }

    } catch (err) {
      console.error('[MOOTA PROCESS ITEM ERROR]', err);
    }
  }
}

// Endpoint Info & Health Check Moota Webhook
app.get(['/api/webhook/moota', '/api/moota/webhook'], (req, res) => {
  res.json({
    status: 'online',
    service: 'Wargaku IPL - Moota Webhook Endpoint',
    endpoint_url: `${getServerUrl(req)}/api/webhook/moota`,
    secret_configured: !!(process.env.MOOTA_WEBHOOK_SECRET && process.env.MOOTA_WEBHOOK_SECRET !== 'isi_secret_dari_atasan'),
    time: new Date().toISOString()
  });
});

// Endpoint Utama POST Webhook Moota
app.post(['/api/webhook/moota', '/api/moota/webhook'], async (req, res) => {
  console.log(`[MOOTA WEBHOOK] 📥 Request masuk pada ${new Date().toISOString()}`);

  // 1. Verifikasi Signature / Secret Token
  const verification = verifyMootaSignature(req);
  if (!verification.valid) {
    console.error('[MOOTA WEBHOOK] ❌ Verifikasi gagal:', verification.reason);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid signature',
      detail: verification.reason
    });
  }

  // 2. Beri respon 200 OK secepat mungkin ke Moota (< 5 detik)
  res.status(200).json({
    status: 'success',
    message: 'Moota webhook payload received successfully',
    timestamp: new Date().toISOString()
  });

  // 3. Proses mutasi secara asinkron di latar belakang
  const rawBody = req.body;
  const mutations = Array.isArray(rawBody)
    ? rawBody
    : (Array.isArray(rawBody?.mutations) ? rawBody.mutations : (Array.isArray(rawBody?.data) ? rawBody.data : [rawBody]));

  setImmediate(() => {
    processMootaMutations(mutations).catch((err) => {
      console.error('[MOOTA ASYNC PROCESS ERROR]', err);
    });
  });
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

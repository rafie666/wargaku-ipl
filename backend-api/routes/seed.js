const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { verifyToken, requireRole } = require('../middleware/auth');
const { requireTenancy } = require('../middleware/tenancy');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.post('/kompleks/:komplek_id/seed', verifyToken, requireTenancy, requireRole('admin', 'superadmin'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { komplek_id } = req.params;

    if (req.user.role === 'admin' && req.user.komplek_id !== komplek_id) {
      return res.status(403).json({ error: 'Anda hanya bisa seed komplek Anda sendiri.' });
    }

    await client.query('BEGIN');

    const rwResult = await client.query(
      `INSERT INTO public.wargaku_rw (komplek_id, nomor_rw, nama_ketua)
       VALUES ($1, '01', 'Ketua RW 01')
       ON CONFLICT (komplek_id, nomor_rw) DO NOTHING
       RETURNING id`,
      [komplek_id]
    );

    let rwId;
    if (rwResult.rows.length > 0) {
      rwId = rwResult.rows[0].id;
    } else {
      const existing = await client.query(
        'SELECT id FROM public.wargaku_rw WHERE komplek_id = $1 AND nomor_rw = $2',
        [komplek_id, '01']
      );
      rwId = existing.rows[0].id;
    }

    const rtResult = await client.query(
      `INSERT INTO public.wargaku_rt (komplek_id, rw_id, nomor_rt, nama_ketua)
       VALUES ($1, $2, '01', 'Ketua RT 01')
       ON CONFLICT (komplek_id, rw_id, nomor_rt) DO NOTHING
       RETURNING id`,
      [komplek_id, rwId]
    );

    let rtId;
    if (rtResult.rows.length > 0) {
      rtId = rtResult.rows[0].id;
    } else {
      const existing = await client.query(
        'SELECT id FROM public.wargaku_rt WHERE komplek_id = $1 AND rw_id = $2 AND nomor_rt = $3',
        [komplek_id, rwId, '01']
      );
      rtId = existing.rows[0].id;
    }

    await client.query(
      `INSERT INTO public.wargaku_jenis_iuran (komplek_id, nama, nominal, tipe, is_active)
       VALUES 
         ($1, 'Iuran Kebersihan', 50000, 'bulanan', true),
         ($1, 'Iuran Keamanan', 100000, 'bulanan', true),
         ($1, 'Iuran Listrik', 25000, 'bulanan', true)
       ON CONFLICT DO NOTHING`,
      [komplek_id]
    );

    await client.query(
      `INSERT INTO public.wargaku_emergency_contacts (komplek_id, nama_pos, nomor_telepon, kategori)
       VALUES 
         ($1, 'Pos Satpam Utama', '081234567000', 'satpam'),
         ($1, 'Ambulans Warga', '081234567111', 'medis')
       ON CONFLICT DO NOTHING`,
      [komplek_id]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Seed data berhasil dibuat.',
      data: {
        rw_id: rwId,
        rt_id: rtId
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[SEED ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;

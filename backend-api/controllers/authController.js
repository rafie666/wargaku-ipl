const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { generateToken } = require('../middleware/auth');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function register(req, res) {
  const client = await pool.connect();
  try {
    const { phone, password, full_name, email, komplek_id, blok, nomor_rumah, rt_id, rw_id } = req.body;

    if (!phone || !password || !full_name || !komplek_id || !rt_id || !rw_id) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap. Wajib: phone, password, full_name, komplek_id, rt_id, rw_id' 
      });
    }

    const existingUser = await client.query(
      'SELECT id FROM public.wargaku_users WHERE phone = $1',
      [phone]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Nomor HP sudah terdaftar.' });
    }

    const komplekCheck = await client.query(
      'SELECT id FROM public.wargaku_kompleks WHERE id = $1 AND is_active = true',
      [komplek_id]
    );
    if (komplekCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Komplek tidak ditemukan atau tidak aktif.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO public.wargaku_users (phone, password_hash, role, status, full_name, email, komplek_id)
       VALUES ($1, $2, 'warga', 'pending_approval', $3, $4, $5)
       RETURNING id, phone, role, status, full_name, komplek_id`,
      [phone, passwordHash, full_name, email || null, komplek_id]
    );

    const newUser = userResult.rows[0];

    if (blok && nomor_rumah) {
      await client.query(
        `INSERT INTO public.wargaku_residents (komplek_id, rw_id, rt_id, blok, nomor_rumah, user_id, tipe_penghuni, status_huni)
         VALUES ($1, $2, $3, $4, $5, $6, 'pemilik', 'tetap')
         ON CONFLICT (komplek_id, blok, nomor_rumah) DO UPDATE SET user_id = $6, updated_at = NOW()`,
        [komplek_id, rw_id, rt_id, blok, nomor_rumah, newUser.id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Akun Anda sedang menunggu persetujuan Admin Komplek.',
      user: newUser
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone dan password wajib diisi.' });
    }

    const { rows } = await pool.query(
      `SELECT id, komplek_id, phone, password_hash, role, status, full_name, email, assigned_rw_id, assigned_rt_id
       FROM public.wargaku_users WHERE phone = $1`,
      [phone]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Nomor HP atau password salah.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Nomor HP atau password salah.' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        error: 'Akun Anda ditolak oleh Admin Komplek.',
        code: 'REJECTED'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Akun Anda telah disuspend. Hubungi Admin Komplek.',
        code: 'SUSPENDED'
      });
    }

    const token = generateToken(user);

    delete user.password_hash;

    res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: err.message });
  }
}

async function approveUser(req, res) {
  const client = await pool.connect();
  try {
    const { user_id } = req.params;
    const { status } = req.body;

    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status harus active atau rejected.' });
    }

    const targetUser = await client.query(
      'SELECT id, komplek_id, status FROM public.wargaku_users WHERE id = $1',
      [user_id]
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Hanya Admin Komplek atau Superadmin yang bisa approve.' });
    }

    if (req.user.role === 'admin' && targetUser.rows[0].komplek_id !== req.user.komplek_id) {
      return res.status(403).json({ error: 'Anda hanya bisa approve user di komplek Anda.' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE public.wargaku_users 
       SET status = $1, approved_by = $2, approved_at = NOW(), updated_at = NOW()
       WHERE id = $3`,
      [status, req.user.id, user_id]
    );

    await client.query(
      `INSERT INTO public.wargaku_audit_logs (komplek_id, user_id, action, target_table, target_id, new_data)
       VALUES ($1, $2, $3, 'wargaku_users', $4, $5)`,
      [req.user.komplek_id, req.user.id, `USER_${status.toUpperCase()}`, user_id, JSON.stringify({ status })]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `User berhasil di-${status}.`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[APPROVE USER ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function getPendingUsers(req, res) {
  try {
    const komplekId = req.user.role === 'superadmin' 
      ? req.query.komplek_id 
      : req.user.komplek_id;

    let query = `
      SELECT u.id, u.phone, u.full_name, u.email, u.role, u.status, u.komplek_id, u.created_at,
             k.nama as komplek_nama
      FROM public.wargaku_users u
      LEFT JOIN public.wargaku_kompleks k ON u.komplek_id = k.id
      WHERE u.status = 'pending_approval'
    `;
    const params = [];

    if (komplekId) {
      params.push(komplekId);
      query += ` AND u.komplek_id = $${params.length}`;
    }

    query += ` ORDER BY u.created_at ASC`;

    const { rows } = await pool.query(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('[GET PENDING USERS ERROR]', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  approveUser,
  getPendingUsers
};

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createKomplekWithAdmin(req, res) {
  const client = await pool.connect();
  try {
    const { kode_komplek, nama, alamat, admin_phone, admin_name, admin_password } = req.body;

    if (!kode_komplek || !nama || !admin_phone || !admin_name || !admin_password) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap. Wajib: kode_komplek, nama, admin_phone, admin_name, admin_password' 
      });
    }

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Hanya Superadmin yang bisa membuat komplek baru.' });
    }

    const existingPhone = await client.query(
      'SELECT id FROM public.wargaku_users WHERE phone = $1',
      [admin_phone]
    );
    if (existingPhone.rows.length > 0) {
      return res.status(409).json({ error: 'Nomor HP Admin sudah terdaftar.' });
    }

    await client.query('BEGIN');

    const komplekResult = await client.query(
      `INSERT INTO public.wargaku_kompleks (kode_komplek, nama, alamat, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id, kode_komplek, nama, alamat, created_at`,
      [kode_komplek, nama, alamat || null]
    );

    const newKomplek = komplekResult.rows[0];

    const passwordHash = await bcrypt.hash(admin_password, 10);

    const adminResult = await client.query(
      `INSERT INTO public.wargaku_users (komplek_id, phone, password_hash, role, status, full_name)
       VALUES ($1, $2, $3, 'admin', 'active', $4)
       RETURNING id, phone, role, status, full_name, komplek_id`,
      [newKomplek.id, admin_phone, passwordHash, admin_name]
    );

    await client.query(
      `INSERT INTO public.wargaku_audit_logs (komplek_id, user_id, action, target_table, target_id, new_data)
       VALUES ($1, $2, 'KOMPLEK_CREATED', 'wargaku_kompleks', $3, $4)`,
      [newKomplek.id, req.user.id, newKomplek.id, JSON.stringify({ kode_komplek, nama })]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Komplek dan Admin berhasil dibuat.',
      komplek: newKomplek,
      admin: adminResult.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[CREATE KOMPLEK ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function unlinkResident(req, res) {
  const client = await pool.connect();
  try {
    const { resident_id } = req.params;

    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Hanya Admin Komplek yang bisa unlink penghuni.' });
    }

    const residentCheck = await client.query(
      'SELECT id, komplek_id, user_id FROM public.wargaku_residents WHERE id = $1',
      [resident_id]
    );

    if (residentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Resident tidak ditemukan.' });
    }

    const resident = residentCheck.rows[0];

    if (req.user.role === 'admin' && resident.komplek_id !== req.user.komplek_id) {
      return res.status(403).json({ error: 'Anda hanya bisa unlink resident di komplek Anda.' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE public.wargaku_residents SET user_id = NULL, status_huni = 'kosong', updated_at = NOW() WHERE id = $1`,
      [resident_id]
    );

    if (resident.user_id) {
      await client.query(
        `UPDATE public.wargaku_users SET status = 'inactive', updated_at = NOW() WHERE id = $1`,
        [resident.user_id]
      );
    }

    await client.query(
      `INSERT INTO public.wargaku_audit_logs (komplek_id, user_id, action, target_table, target_id, new_data)
       VALUES ($1, $2, 'RESIDENT_UNLINKED', 'wargaku_residents', $3, $4)`,
      [resident.komplek_id, req.user.id, resident_id, JSON.stringify({ old_user_id: resident.user_id })]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Penghuni berhasil dinonaktifkan dan rumah dikosongkan.'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[UNLINK RESIDENT ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function assignRole(req, res) {
  const client = await pool.connect();
  try {
    const { user_id } = req.params;
    const { new_role, assigned_rw_id, assigned_rt_id } = req.body;

    const allowedRoles = ['warga', 'rw', 'rt', 'bendahara', 'pengurus'];
    if (!allowedRoles.includes(new_role)) {
      return res.status(400).json({ error: `Role harus salah satu dari: ${allowedRoles.join(', ')}` });
    }

    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Hanya Admin Komplek yang bisa assign role.' });
    }

    const targetUser = await client.query(
      'SELECT id, komplek_id, role FROM public.wargaku_users WHERE id = $1',
      [user_id]
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    if (req.user.role === 'admin' && targetUser.rows[0].komplek_id !== req.user.komplek_id) {
      return res.status(403).json({ error: 'Anda hanya bisa assign role di komplek Anda.' });
    }

    await client.query('BEGIN');

    await client.query(
      `UPDATE public.wargaku_users 
       SET role = $1, assigned_rw_id = $2, assigned_rt_id = $3, updated_at = NOW()
       WHERE id = $4`,
      [new_role, assigned_rw_id || null, assigned_rt_id || null, user_id]
    );

    await client.query(
      `INSERT INTO public.wargaku_audit_logs (komplek_id, user_id, action, target_table, target_id, new_data)
       VALUES ($1, $2, 'ROLE_ASSIGNED', 'wargaku_users', $3, $4)`,
      [req.user.komplek_id, req.user.id, user_id, JSON.stringify({ new_role, assigned_rw_id, assigned_rt_id })]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Role user berhasil diubah menjadi ${new_role}.`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ASSIGN ROLE ERROR]', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = {
  createKomplekWithAdmin,
  unlinkResident,
  assignRole
};

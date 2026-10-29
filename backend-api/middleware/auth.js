const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const JWT_SECRET = process.env.JWT_SECRET || 'wargaku-ipl-secret-2026-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      komplek_id: user.komplek_id,
      status: user.status,
      assigned_rw_id: user.assigned_rw_id,
      assigned_rt_id: user.assigned_rt_id
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { rows } = await pool.query(
      'SELECT id, komplek_id, phone, role, status, full_name, email, assigned_rw_id, assigned_rt_id FROM public.wargaku_users WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User tidak ditemukan.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Silakan login ulang.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token tidak valid.' });
    }
    return res.status(500).json({ error: err.message });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Akses ditolak. Role Anda tidak memiliki hak akses.',
        required: allowedRoles,
        current: req.user.role
      });
    }
    next();
  };
}

function requireStatus(...allowedStatuses) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedStatuses.includes(req.user.status)) {
      return res.status(403).json({ 
        error: 'Akun Anda tidak aktif atau sedang menunggu persetujuan.',
        code: 'ACCOUNT_NOT_ACTIVE',
        status: req.user.status
      });
    }
    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  requireRole,
  requireStatus,
  JWT_SECRET
};

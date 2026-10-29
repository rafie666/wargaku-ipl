function requireTenancy(req, res, next) {
  const user = req.user;

  if (user.role === 'superadmin') {
    req.targetKomplekId = req.query.komplek_id || req.body.komplek_id || null;
    return next();
  }

  if (!user.komplek_id) {
    return res.status(403).json({ 
      error: 'Akses ditolak: User tidak terdaftar dalam komplek manapun.',
      code: 'NO_KOMPLEK'
    });
  }

  if (user.status === 'pending_approval') {
    return res.status(403).json({ 
      error: 'Akun Anda sedang menunggu persetujuan Admin Komplek.',
      code: 'PENDING_APPROVAL'
    });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ 
      error: 'Akun Anda tidak aktif atau telah dinonaktifkan.',
      code: 'ACCOUNT_INACTIVE',
      status: user.status
    });
  }

  req.targetKomplekId = user.komplek_id;
  next();
}

function scopeQueryByKomplek(user, baseQuery, params = []) {
  if (user.role === 'superadmin') {
    return { query: baseQuery, params };
  }

  const komplekCondition = params.length === 0 
    ? `WHERE komplek_id = $1` 
    : `AND komplek_id = $${params.length + 1}`;
  
  return {
    query: baseQuery.includes('WHERE') 
      ? baseQuery.replace('WHERE', `WHERE komplek_id = $${params.length + 1} AND`)
      : `${baseQuery} ${komplekCondition}`,
    params: [...params, user.komplek_id]
  };
}

module.exports = {
  requireTenancy,
  scopeQueryByKomplek
};

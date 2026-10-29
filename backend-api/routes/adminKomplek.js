const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminKomplekController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { requireTenancy } = require('../middleware/tenancy');

router.post('/komplek', verifyToken, requireRole('superadmin'), adminController.createKomplekWithAdmin);
router.patch('/residents/:resident_id/unlink', verifyToken, requireTenancy, requireRole('admin', 'superadmin'), adminController.unlinkResident);
router.patch('/users/:user_id/assign-role', verifyToken, requireTenancy, requireRole('admin', 'superadmin'), adminController.assignRole);

module.exports = router;

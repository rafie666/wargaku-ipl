const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { requireTenancy } = require('../middleware/tenancy');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/pending-users', verifyToken, requireTenancy, requireRole('admin', 'superadmin'), authController.getPendingUsers);
router.patch('/users/:user_id/approve', verifyToken, requireTenancy, requireRole('admin', 'superadmin'), authController.approveUser);

module.exports = router;

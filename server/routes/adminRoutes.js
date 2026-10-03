const express = require('express');
const router = express.Router();
const { login, getStats } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// Public — legacy admin-only login (still supported for AdminLogin.jsx)
router.post('/login', login);

// Protected admin routes — require valid JWT with role: 'admin'
router.get('/stats', protect, requireAdmin, getStats);

module.exports = router;

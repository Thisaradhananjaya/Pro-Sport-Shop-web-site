const express = require('express');
const router = express.Router();
const { login, getStats, getTopSellingProducts } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// Public — legacy admin-only login (still supported for AdminLogin.jsx)
router.post('/login', login);

// Protected admin routes — require valid JWT with role: 'admin'
router.get('/stats', protect, requireAdmin, getStats);
router.get('/top-products', protect, requireAdmin, getTopSellingProducts);

module.exports = router;

const express = require('express');
const router = express.Router();
const { login, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Public — admin login
router.post('/login', login);

// Protected — dashboard stats (requires valid JWT)
router.get('/stats', protect, getStats);

module.exports = router;

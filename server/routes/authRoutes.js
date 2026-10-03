const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register  — public, creates customer only
router.post('/register', register);

// POST /api/auth/login     — public, unified admin + customer
router.post('/login', login);

// POST /api/auth/logout    — clears cookie / signals client
router.post('/logout', logout);

// GET  /api/auth/me        — protected, returns current user
router.get('/me', protect, getMe);

module.exports = router;

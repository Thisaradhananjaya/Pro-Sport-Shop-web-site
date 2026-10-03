const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_jwt_super_secret_change_in_production_2026';
const JWT_EXPIRES = '7d';

/* ─────────────────────────────────────────────────
   POST /api/auth/register
   Registers a new customer. Role is forcefully set
   to 'customer' – no way to become admin here.
───────────────────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Validation */
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    /* Block registration with the admin email */
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@prosport.com').toLowerCase();
    if (email.toLowerCase() === adminEmail) {
      return res.status(403).json({ success: false, message: 'This email address is reserved.' });
    }

    /* Check duplicate */
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    /* Create – role is always 'customer', ignored from body */
    const user = await User.create({ name, email, password, role: 'customer' });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'customer' },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/* ─────────────────────────────────────────────────
   POST /api/auth/login
   Unified login for both admins and customers.
   Returns a JWT with role embedded.
───────────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    /* 1 — Check Admin collection first */
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) {
      const match = await admin.comparePassword(password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
      });
    }

    /* 2 — Check Customer collection */
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'customer' },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

/* ─────────────────────────────────────────────────
   POST /api/auth/logout
   Stateless JWT logout — clears the HTTP-only cookie
   (if used) and signals the client to clear storage.
───────────────────────────────────────────────── */
exports.logout = (req, res) => {
  // If you switch to HTTP-only cookies, clear it here:
  res.clearCookie('prosport_token', { httpOnly: true, sameSite: 'strict' });
  return res.json({ success: true, message: 'Logged out successfully.' });
};

/* ─────────────────────────────────────────────────
   GET /api/auth/me
   Returns the current user info from the JWT.
   Requires a valid token (handled by protect middleware).
───────────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'admin') {
      const admin = await Admin.findById(id).select('-password');
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
      return res.json({ success: true, user: { ...admin.toObject(), role: 'admin' } });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * authController.js
 * ─────────────────────────────────────────────────────────────────
 * Handles all authentication logic for PROSPORT.
 *
 * Architecture (unified model):
 *   • Both admins and customers live in the User collection.
 *   • Admins have role: 'admin', customers have role: 'customer'.
 *   • The default admin is created by utils/seedAdmin.js on startup.
 *   • Public registration (/register) always produces role: 'customer'.
 * ─────────────────────────────────────────────────────────────────
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_jwt_super_secret_change_in_production_2026';
const JWT_EXPIRES = '7d';

/* ─────────────────────────────────────────────────
   Helper — build & sign a JWT for any user
───────────────────────────────────────────────── */
const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

/* ─────────────────────────────────────────────────
   POST /api/auth/register
   Registers a new CUSTOMER only.
   Role is forcefully set to 'customer' — the body's
   role field is completely ignored.
───────────────────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validate required fields ──
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // ── Block the reserved admin email from public registration ──
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@prosport.com').toLowerCase();
    if (email.toLowerCase() === adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'This email address is reserved.',
      });
    }

    // ── Check for duplicate email ──
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // ── Create customer (role is ALWAYS 'customer' — never from req.body) ──
    const user = await User.create({
      name,
      email,
      password,        // pre-save hook hashes this automatically
      role: 'customer', // forcefully set — ignores anything sent from frontend
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/* ─────────────────────────────────────────────────
   POST /api/auth/login
   Unified login for BOTH admins and customers.
   Single User collection — role field determines
   what the JWT contains and where the frontend redirects.
───────────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate inputs ──
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ── Look up the user (admin or customer — same collection) ──
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Generic message — don't reveal whether email exists
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // ── Verify password ──
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // ── Check account is active (customers only; admins are always active) ──
    if (user.role === 'customer' && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact support.',
      });
    }

    // ── Generate JWT with role embedded ──
    const token = signToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

/* ─────────────────────────────────────────────────
   POST /api/auth/logout
   Stateless JWT logout.
   Clears the HTTP-only cookie (if used) and signals
   the client to remove the token from localStorage.
───────────────────────────────────────────────── */
exports.logout = (req, res) => {
  // Clear cookie if using HTTP-only cookie strategy
  res.clearCookie('prosport_token', { httpOnly: true, sameSite: 'strict' });
  return res.json({ success: true, message: 'Logged out successfully.' });
};

/* ─────────────────────────────────────────────────
   GET /api/auth/me
   Returns the current authenticated user's data.
   Requires a valid Bearer token (protect middleware
   must run before this handler).
───────────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  try {
    // req.user is attached by the protect middleware after JWT verification
    const user = await User.findById(req.user.id); // toJSON() strips password
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

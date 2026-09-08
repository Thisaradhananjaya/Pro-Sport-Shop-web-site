const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_admin_secret_2026';
const JWT_EXPIRES = '24h';

// Admin credentials — read from .env, with safe defaults for dev
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@prosport.lk').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ProSport@2026';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Pro Sport Admin';

/**
 * POST /api/admin/login
 * Validates admin credentials and returns a signed JWT.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Compare against env-configured admin credentials
    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Support both plain-text env password and bcrypt-hashed passwords
    let passwordMatch = false;
    if (ADMIN_PASSWORD.startsWith('$2')) {
      // Looks like a bcrypt hash
      passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      // Plain-text comparison (dev mode)
      passwordMatch = password === ADMIN_PASSWORD;
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { email: ADMIN_EMAIL, name: ADMIN_NAME },
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * GET /api/admin/stats
 * Returns high-level dashboard statistics. Protected route.
 */
exports.getStats = async (req, res) => {
  try {
    const isMongoConnected = Product.db && Product.db.readyState === 1;

    let productCount = 0;
    let categoryBreakdown = {};

    if (isMongoConnected) {
      productCount = await Product.countDocuments();
      const agg = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      agg.forEach(item => { categoryBreakdown[item._id] = item.count; });
    } else {
      // Fallback: use mock data
      const { productsData } = require('../data/seedData');
      productCount = productsData.length;
      productsData.forEach(p => {
        categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
      });
    }

    return res.json({
      success: true,
      data: {
        productCount,
        categoryBreakdown,
        usingMockData: !isMongoConnected,
      },
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

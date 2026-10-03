const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_jwt_super_secret_change_in_production_2026';
const JWT_EXPIRES = '7d';

/**
 * POST /api/admin/login
 * Legacy admin-only login endpoint (kept for backward compatibility).
 * The unified /api/auth/login also handles admin login.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
      admin: { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
      // Also populate 'user' field for compatibility with AuthContext
      user: { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
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

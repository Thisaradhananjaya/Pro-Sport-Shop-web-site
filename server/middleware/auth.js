const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_admin_secret_2026';

/**
 * Middleware to verify JWT token on protected admin routes.
 * Attaches the decoded admin payload to req.admin.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = { protect };

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prosport_jwt_super_secret_change_in_production_2026';

/* ─────────────────────────────────────────────────
   protect
   Verifies JWT from Authorization header.
   Attaches decoded payload to req.user.
   Supports both admin and customer tokens.
───────────────────────────────────────────────── */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;   // { id, email, name, role }
    req.admin = decoded;  // backward-compat for existing admin routes
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
  }
};

/* ─────────────────────────────────────────────────
   requireAdmin
   Must be used AFTER protect.
   Rejects requests where role !== 'admin'.
───────────────────────────────────────────────── */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access only.' });
  }
  next();
};

/* ─────────────────────────────────────────────────
   requireCustomer
   Must be used AFTER protect.
   Rejects requests where role !== 'customer'.
───────────────────────────────────────────────── */
const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Customer access only.' });
  }
  next();
};

module.exports = { protect, requireAdmin, requireCustomer };

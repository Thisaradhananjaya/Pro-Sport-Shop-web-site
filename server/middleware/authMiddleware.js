/**
 * authMiddleware.js
 * ─────────────────────────────────────────────────────────────────
 * Re-exports all auth middleware from auth.js so that both the
 * conventional name (authMiddleware.js) and the original (auth.js)
 * work seamlessly. The aliases below match exactly the names used
 * in the requirements: protect, adminOnly, customerOnly.
 * ─────────────────────────────────────────────────────────────────
 */

const {
  protect,
  requireAdmin,
  requireCustomer,
} = require('./auth');

/* ─────────────────────────────────────────────────
   protect
   Verifies the JWT from the Authorization: Bearer
   header and attaches the decoded payload to
   req.user = { id, email, name, role }.
   Use on any route that needs an authenticated user.
───────────────────────────────────────────────── */
// Already exported by auth.js — re-export with same name
exports.protect = protect;

/* ─────────────────────────────────────────────────
   adminOnly  (alias for requireAdmin)
   Must be chained AFTER protect.
   Returns 403 Forbidden if req.user.role !== 'admin'.

   Usage:
     router.get('/secret', protect, adminOnly, handler);
───────────────────────────────────────────────── */
exports.adminOnly = requireAdmin;

/* ─────────────────────────────────────────────────
   customerOnly  (alias for requireCustomer)
   Must be chained AFTER protect.
   Returns 403 Forbidden if req.user.role !== 'customer'.
───────────────────────────────────────────────── */
exports.customerOnly = requireCustomer;

/* Also re-export the original names for backward compat */
exports.requireAdmin    = requireAdmin;
exports.requireCustomer = requireCustomer;

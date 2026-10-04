/**
 * utils/seedAdmin.js
 * ─────────────────────────────────────────────────────────────────
 * Automatically seeds the default Super Admin user into the
 * database when the server starts — but ONLY if that admin
 * does not already exist.
 *
 * Design decisions:
 *   • Uses the unified User model (role field = 'admin').
 *   • Password is hashed with bcrypt (salt rounds = 10) inside
 *     the User model's pre-save hook, so we pass the plain text
 *     and Mongoose handles the hashing automatically.
 *   • Idempotent: safe to call on every server restart because
 *     User.findOne() runs first — if the admin exists, we skip.
 *   • Admin is NEVER creatable via /api/auth/register; that route
 *     forcefully sets role: 'customer'.
 * ─────────────────────────────────────────────────────────────────
 */

const User   = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * seedAdmin()
 * ─────────────────────────────────────────────────────────────────
 * Called by server.js right after MongoDB connects successfully.
 * Checks if admin@prosport.com already exists; creates it if not.
 */
const seedAdmin = async () => {
  try {
    // ── Step 1: Read credentials from .env (with safe fallbacks) ──
    const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@prosport.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName     = process.env.ADMIN_NAME     || 'Super Admin';

    // ── Step 2: Check if the admin user already exists ──
    // This prevents duplicate creation and avoids duplicate-key errors
    // even if the server restarts multiple times.
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      // Admin already in the database — nothing to do
      console.log('ℹ️  Admin already exists. Skipping seed.');
      return;
    }

    // ── Step 3: Create the default admin user ──
    // The User model's pre-save hook hashes the password automatically
    // using bcrypt with salt rounds = 10 (configured in User.js).
    await User.create({
      name:     adminName,     // "Super Admin"
      email:    adminEmail,    // "admin@prosport.com"
      password: adminPassword, // "Admin@123" → pre-save hook hashes this
      role:     'admin',       // Explicitly set — only the seeder can do this
    });

    // ── Step 4: Confirm success ──
    console.log(`✅ Default Admin created: ${adminEmail} / ${adminPassword}`);

  } catch (err) {
    // Gracefully handle any DB or validation errors
    console.error('❌ [seedAdmin] Failed to seed default admin:', err.message);
  }
};

module.exports = { seedAdmin };

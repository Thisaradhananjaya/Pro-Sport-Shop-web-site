/**
 * server/seedAdmin.js  (CLI entry-point — delegates to utils/seedAdmin.js)
 * ─────────────────────────────────────────────────────────────────
 * The core seedAdmin logic now lives in server/utils/seedAdmin.js.
 * This file exists so `npm run seed:admin` still works from the CLI.
 *
 * Usage:
 *   npm run seed:admin          (via package.json script)
 *   node server/seedAdmin.js    (directly)
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const dns      = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (_) {}

const mongoose = require('mongoose');
const { seedAdmin } = require('./utils/seedAdmin');


const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prosport';

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB Connected');

    await seedAdmin();

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ seedAdmin CLI failed:', err.message);
    process.exit(1);
  }
})();

// Re-export for any legacy imports
module.exports = { seedAdmin };

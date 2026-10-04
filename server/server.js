/**
 * server.js — PROSPORT Express Backend
 * ─────────────────────────────────────────────────────────────────
 * Startup sequence (in order):
 *   1. mongoose.connect()   → connect to MongoDB
 *   2. seedAdmin()          → create default admin if not in DB
 *   3. app.listen()         → start accepting HTTP requests
 *
 * This guarantees the database is ready and the admin exists
 * before any API request can be handled.
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const dns      = require('dns');

// Configure public DNS resolvers to prevent Windows SRV lookup issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}


// ── Utilities ──
const { seedAdmin } = require('./utils/seedAdmin');

// ── Route modules ──
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── API Routes ──
app.use('/api/auth',     authRoutes);     // register / login / logout / me
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin',    adminRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status:    'online',
    store:     'PRO SPORT E-Commerce API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Production: serve built React frontend ──
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDist, 'index.html'));
  });
}

/* ═══════════════════════════════════════════════════════════════
   DATABASE → SEED → LISTEN
   The server only starts listening AFTER:
     1. MongoDB is connected
     2. The default admin has been seeded (or confirmed to exist)
   This matches the exact pattern requested:
     mongoose.connect().then(async () => { await seedAdmin(); app.listen(); })
════════════════════════════════════════════════════════════════ */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prosport';

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
  })
  .then(async () => {
    // ── Step 1: MongoDB is connected ──
    const host    = mongoose.connection.host;
    const isAtlas = MONGO_URI.includes('mongodb+srv');
    console.log(isAtlas
      ? `✅ MongoDB Atlas Connected: ${host}`
      : `✅ MongoDB Connected: ${host}`
    );

    // ── Step 2: Seed the default admin (skips if already exists) ──
    await seedAdmin();

    // ── Step 3: Start the HTTP server only after seed is done ──
    app.listen(PORT, () => {
      console.log(`🚀 Pro Sport Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // If MongoDB connection fails, log clearly with troubleshooting checklist and exit
    console.error('\n❌ MongoDB Connection Error:', err.message);
    console.error('\n📋 Please check the following:');
    console.error('   1. Internet connection — ensure your device is connected to the internet.');
    console.error('   2. MONGO_URI in .env — verify the connection string syntax and database name.');
    console.error('   3. MongoDB Atlas IP whitelist — ensure your current IP address (or 0.0.0.0/0) is allowed under Network Access.');
    console.error('   4. Database user password — verify username and password under Database Access in MongoDB Atlas.\n');
    process.exit(1);
  });


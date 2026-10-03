require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Admin = require('./models/Admin');
const { productsData, categoriesData } = require('./data/seedData');
const connectDB = require('./config/db');

/* -------------------------------------------------------
   seedAdmin – runs on every server start.
   Creates the default admin from .env if not yet in DB.
   ------------------------------------------------------- */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prosport.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'Pro Sport Admin';

    const existing = await Admin.findOne({ email: adminEmail });

    if (!existing) {
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // pre-save hook in Admin.js hashes this
        role: 'admin',
      });
      console.log(`✅ [Seed]: Default admin created → ${adminEmail}`);
    } else {
      console.log(`ℹ️  [Seed]: Admin already exists (${adminEmail}) – skipping`);
    }
  } catch (error) {
    console.error(`❌ [Seed]: Admin seeding failed – ${error.message}`);
  }
};

/* -------------------------------------------------------
   importData – seeds products & categories
   Usage: node seeder.js
   ------------------------------------------------------- */
const importData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('Skipping DB write since MongoDB is not connected.');
      process.exit();
    }

    await Product.deleteMany();
    await Category.deleteMany();

    const formattedProducts = productsData.map(p => {
      const { id, ...rest } = p;
      return rest;
    });

    await Category.insertMany(categoriesData);
    await Product.insertMany(formattedProducts);

    console.log('✅ Pro Sport Catalog successfully seeded to MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

/* -------------------------------------------------------
   CLI entry points
   ------------------------------------------------------- */
if (process.argv[2] === '-d') {
  // Destroy: node seeder.js -d
  (async () => {
    await connectDB();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('🗑️  Data Destroyed!');
    process.exit();
  })();
} else if (require.main === module) {
  // Run directly: node seeder.js
  importData();
}

// Export for use in server.js startup
module.exports = { seedAdmin };

require('dotenv').config();

// ✅ Force Google DNS to fix SRV resolution
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (_) { }

const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const { productsData, categoriesData } = require('./data/seedData');

/* -------------------------------------------------------
   importData – seeds products & categories
   Usage: node seeder.js
   ------------------------------------------------------- */
const importData = async () => {
  try {
    // ✅ Step 1: Connect directly to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    // ✅ Step 2: Wait for connection to be fully ready
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
        return;
      }
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout after 15 seconds'));
      }, 15000);

      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });

      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    // ✅ Step 3: Now safe to run operations
    console.log('🗑️  Clearing existing products and categories...');
    await Product.deleteMany();
    await Category.deleteMany();

    // ✅ Step 4: Format products (remove 'id' field, use MongoDB '_id')
    const formattedProducts = productsData.map(p => {
      const { id, ...rest } = p;
      return rest;
    });

    // ✅ Step 5: Insert data
    console.log('📦 Inserting categories...');
    await Category.insertMany(categoriesData);

    console.log('📦 Inserting products...');
    await Product.insertMany(formattedProducts);

    console.log('✅ Pro Sport Catalog successfully seeded to MongoDB!');

    // ✅ Step 6: Close connection and exit
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

/* -------------------------------------------------------
   Destroy Data
   Usage: node seeder.js -d
   ------------------------------------------------------- */
const destroyData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    await Product.deleteMany();
    await Category.deleteMany();

    console.log('🗑️  Data Destroyed!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Destroy failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

/* -------------------------------------------------------
   CLI entry points
   ------------------------------------------------------- */
if (process.argv[2] === '-d') {
  destroyData();
} else if (require.main === module) {
  importData();
}

module.exports = { importData };
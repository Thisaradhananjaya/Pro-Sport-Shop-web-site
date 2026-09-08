require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const { productsData, categoriesData } = require('./data/seedData');
const connectDB = require('./config/db');

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

if (process.argv[2] === '-d') {
  // destroy
  (async () => {
    await connectDB();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  })();
} else {
  importData();
}

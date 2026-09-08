const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prosport';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Notice]: Could not connect to local/remote MongoDB (${error.message}).`);
    console.log('[System]: Running in Hybrid In-Memory/Offline fallback mode with full mock data access.');
    return false;
  }
};

module.exports = connectDB;

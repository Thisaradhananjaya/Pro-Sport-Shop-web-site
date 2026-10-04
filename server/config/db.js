const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prosport';
  const isAtlas = connUri.includes('mongodb+srv');

  try {
    // ✅ If already connected, reuse the connection
    if (mongoose.connection.readyState === 1) {
      console.log('ℹ️  MongoDB already connected. Reusing existing connection.');
      return true;
    }

    // ✅ Connect with proper options
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    // ✅ Wait until connection is fully established
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) return resolve();
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    const host = mongoose.connection.host;
    if (isAtlas) {
      console.log(`✅ [MongoDB Atlas Connected]: ${host}`);
    } else {
      console.log(`✅ [MongoDB Local Connected]: ${host}`);
    }

    return true;
  } catch (error) {
    if (isAtlas) {
      console.error('❌ [MongoDB Atlas Error]: Could not connect to Atlas.');
      console.error(`   → Error: ${error.message}`);
    } else {
      console.warn('⚠️  [MongoDB Notice]: Could not connect to local MongoDB.');
      console.warn(`   → Error: ${error.message}`);
    }
    console.log('🔄 [System]: Running in offline/mock-data fallback mode.');
    return false;
  }
};

module.exports = connectDB;
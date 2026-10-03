const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prosport';
  const isAtlas = connUri.includes('mongodb+srv');

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,  // 5 s timeout (Atlas needs more than 2.5 s sometimes)
    });

    const host = conn.connection.host;
    if (isAtlas) {
      console.log(`✅ [MongoDB Atlas Connected]: ${host}`);
    } else {
      console.log(`✅ [MongoDB Local Connected]: ${host}`);
    }

    return true;
  } catch (error) {
    if (isAtlas) {
      console.error('❌ [MongoDB Atlas Error]: Could not connect to Atlas.');
      console.error('   → Check your MONGO_URI in .env — make sure USERNAME, PASSWORD, and CLUSTER are correct.');
      console.error(`   → Error: ${error.message}`);
    } else {
      console.warn('⚠️  [MongoDB Notice]: Could not connect to local MongoDB.');
      console.warn('   → Make sure MongoDB is running locally (mongod), or switch to Atlas in .env');
      console.warn(`   → Error: ${error.message}`);
    }

    console.log('🔄 [System]: Running in offline/mock-data fallback mode.');
    return false;
  }
};

module.exports = connectDB;

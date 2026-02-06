const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Listen for connection events
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log(`🔴 Mongoose connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Mongoose disconnected from DB');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check:');
    console.error('1. Your MONGODB_URI in .env file');
    console.error('2. Network access in MongoDB Atlas');
    console.error('3. Database user credentials');
    process.exit(1);
  }
};

module.exports = connectDB;
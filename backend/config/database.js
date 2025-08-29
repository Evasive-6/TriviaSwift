import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/triviaswift';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

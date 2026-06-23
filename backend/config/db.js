import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

if (process.env.USE_CUSTOM_DNS === 'true') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB 👍');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

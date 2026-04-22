import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI || MONGODB_URI.includes('cluster0.mongodb.net')) {
    console.warn('MONGODB_URI is not correctly configured. Running in Mock Mode.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      cached.promise = null; // Reset for retry
      return null;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
// Specify the database name you want to use
const DB_NAME = process.env.DB_NAME; // Change this to your preferred database name

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME, // This specifies which database to use
    };

    console.log(`Connecting to MongoDB database: ${DB_NAME}`);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`Connected to MongoDB database: ${DB_NAME}`);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

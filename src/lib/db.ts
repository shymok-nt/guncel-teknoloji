import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";

if (!process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), ".env.local") });
}

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error(
    "Lütfen .env.local dosyasında DATABASE_URL ortam değişkenini tanımlayın."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function attemptConnect(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || "guncel-teknoloji",
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch {
    cached.promise = null;
    return null;
  }
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const retries = [0, 3000];
  for (let i = 0; i < retries.length; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, retries[i]));
    }
    const conn = await attemptConnect();
    if (conn) return conn;
  }
  return null;
}

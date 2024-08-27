import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongoDB = async() => {
  try {
    const url = `${process.env.DB_URL}${process.env.DB_HOST}:${process.env.DB_PORT}`;
    await mongoose.connect(url, {
      dbName: process.env.DB_NAME,
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", JSON.stringify(err));
    process.exit(1);
  }
}

import mongoose from "mongoose";
import { env } from "./config";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: env.MONGO_DB_NAME,
    });
  } catch (err) {
    console.error("Connection to database unssucessfully: ", err);
    throw err;
  }
};

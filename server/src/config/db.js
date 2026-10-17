import mongoose from "mongoose";
import config from "./config.js";

export async function connectToDB() {
  if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Please add it to the .env file in the project root.");
  }

  await mongoose.connect(config.MONGO_URI);

  console.log("Database is connected");
}


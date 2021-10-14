import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  console.log("Strting auth service");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT Key is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connection success");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth service listening on port 3000");
  });
};

start();

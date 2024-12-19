// Note: This is 'require' method to import .env
// require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

import connectDB from "./db/index.js";

connectDB();

/*
Note: This is appraoch one to connect the server with DB

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("Error ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error ", error);
    throw error;
  }
})();
*/

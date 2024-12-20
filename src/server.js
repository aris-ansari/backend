// Importing the `dotenv` library to load environment variables from a `.env` file into `process.env`
import dotenv from "dotenv";

// Importing the `connectDB` function to establish a connection with the MongoDB database
import connectDB from "./db/index.js";

// Importing the `app` instance (an Express application) from another file
import app from "./app.js";

// Loading environment variables from a file named `env` in the root directory
dotenv.config({
  path: "./env", // Path to the environment file
});

// Defining the port for the server to listen on, using the `PORT` value from environment variables
// Defaults to 8000 if `PORT` is not defined in `process.env`
const PORT = process.env.PORT || 8000;

// Calling the `connectDB` function to establish the database connection
connectDB()
  .then(() => {
    // If the database connection is successful, start the server
    app.listen(PORT, () => {
      // Log a success message showing the port where the server is running
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    // If the database connection fails, log an error message and the error details
    console.error("MongoDB connection failed !!", error);
  });

/*
Note: This is appraoch one to connect the server with DB

// Importing the `mongoose` library to connect to a MongoDB database
import mongoose from "mongoose";

// Importing the database name constant from a separate file
import { DB_NAME } from "./constants";

// Importing the `express` library to create and manage a web server
import express from "express";

// Creating an instance of an Express application
const app = express();

// Using an Immediately Invoked Function Expression (IIFE) to handle asynchronous code
(async () => {
  try {
    // Connecting to the MongoDB database using `mongoose.connect`
    // The connection URI is constructed using an environment variable and the database name
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // Setting up an event listener for any `error` events on the Express app instance
    app.on("error", (error) => {
      // Log the error message to the console
      console.error("Error ", error);
      // Throw the error to propagate it for further handling
      throw error;
    });

    // Starting the server to listen for incoming requests on the specified port
    app.listen(process.env.PORT, () => {
      // Log a success message showing the port number where the server is running
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    // If any error occurs during database connection or server setup, log it to the console
    console.error("Error ", error);
    // Throw the error to allow the process to handle it as needed
    throw error;
  }
})();

*/

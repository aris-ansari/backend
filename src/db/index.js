// Importing the `mongoose` library to interact with MongoDB
// `connect` is a named export from "mongoose", but it's not used in this code
import mongoose, { connect } from "mongoose";

// Importing the database name constant from a separate file
import { DB_NAME } from "../constants.js";

// Defining an asynchronous function to establish a connection with the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the `mongoose.connect` method
    // The connection URI is created dynamically using environment variables and the database name
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Log a success message to the console, including the host of the connected database
    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    // If an error occurs during the connection attempt, log the error message to the console
    console.error("MongoDB connection failed!", error);

    // Exit the Node.js process with a failure status code (1 indicates an error)
    // `process.exit` immediately stops the program, useful for handling critical errors
    process.exit(1);
  }
};

// Exporting the `connectDB` function so it can be used in other files
export default connectDB;

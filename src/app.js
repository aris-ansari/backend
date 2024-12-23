// Importing the `express` library to create a web server and handle HTTP requests
import express from "express";

// Importing the `cors` library to enable Cross-Origin Resource Sharing,
// which allows your server to accept requests from different origins
import cors from "cors";

// Importing the `cookie-parser` library to parse cookies in incoming requests
import cookieParser from "cookie-parser";

// Creating an instance of the Express application
const app = express();

// Adding CORS middleware to handle Cross-Origin Resource Sharing
app.use(
  cors({
    // Specifies the allowed origin for requests, which is set using an environment variable
    origin: process.env.CORS_ORIGIN,
    // Enables cookies and other credentials to be sent in cross-origin requests
    credentials: true,
  })
);

// Middleware to parse incoming request bodies as JSON format with a size limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Middleware to parse incoming request bodies as URL-encoded data (e.g., form submissions),
// allowing nested objects and with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files (e.g., images, CSS, JavaScript) from the "public" folder
app.use(express.static("public"));

// Adding middleware to parse cookies in incoming HTTP requests
// `cookieParser()` reads the "Cookie" header from the request and makes it available as an object in `req.cookies`
// This is useful for managing sessions, authentication, and tracking user data
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export default app;

import mongoose from "mongoose"; 
// Import the mongoose library to interact with MongoDB.

import bcrypt from "bcrypt"; 
// Import bcrypt for hashing passwords securely.

import jwt from "jsonwebtoken"; 
// Import jsonwebtoken for generating and verifying JWTs (JSON Web Tokens).

// Define the schema for the User model.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, // The username should be a string.
      required: true, // It is mandatory to provide a username.
      lowercase: true, // The username will be stored in lowercase.
      unique: true, // Each username must be unique in the database.
      trim: true, // Removes any leading or trailing spaces from the username.
      index: true, // Adds an index to this field for faster queries.
    },
    email: {
      type: String, // The email should be a string.
      required: true, // It is mandatory to provide an email.
      lowercase: true, // The email will be stored in lowercase.
      unique: true, // Each email must be unique in the database.
      trim: true, // Removes any leading or trailing spaces from the email.
    },
    fullname: {
      type: String, // The full name should be a string.
      required: true, // It is mandatory to provide a full name.
      trim: true, // Removes any leading or trailing spaces from the full name.
      index: true, // Adds an index to this field for faster queries.
    },
    avatar: {
      type: String, // The avatar is stored as a URL (e.g., from Cloudinary).
      required: true, // It is mandatory to provide an avatar URL.
    },
    coverImage: {
      type: String, // The cover image is also stored as a URL.
    },
    watchHistory: {
      type: mongoose.Schema.Types.ObjectId, // References an object ID in another collection.
      ref: "Video", // Refers to the "Video" collection in the database.
    },
    password: {
      type: String, // The password should be a string.
      required: [true, "Password is required!"], // It is mandatory to provide a password with a custom error message.
    },
    refreshToken: {
      type: String, // The refresh token is stored as a string.
    },
  },
  { timestamps: true } 
  // Adds 'createdAt' and 'updatedAt' fields to the schema, automatically managed by Mongoose.
);

// Pre-save middleware to hash the password before saving a user document.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  // If the password field is not modified, skip the hashing process.

  this.password = bcrypt.hash(this.password, 10); 
  // Hash the password with a salt round of 10 for security.
  next(); // Proceed to save the document.
});

// Method to compare a plain-text password with the hashed password stored in the database.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); 
  // Returns true if the passwords match, false otherwise.
};

// Method to generate an access token for the user.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Include the user's ID in the token payload.
      email: this.email, // Include the user's email in the token payload.
      username: this.username, // Include the username in the token payload.
      fullname: this.fullname, // Include the full name in the token payload.
    },
    process.env.ACCESS_TOKEN_SECRET, // Use a secret key from environment variables to sign the token.
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } 
    // Set the token's expiration time from environment variables.
  );
};

// Method to generate a refresh token for the user.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Include the user's ID in the token payload.
    },
    process.env.REFRESH_TOKEN_SECRET, // Use a secret key from environment variables to sign the refresh token.
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } 
    // Set the refresh token's expiration time from environment variables.
  );
};

// Create and export the User model based on the schema.
export const User = mongoose.model("User", userSchema);

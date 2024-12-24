// Import the asyncHandler utility to handle asynchronous errors
import asyncHandler from "../utils/asyncHandler.js";

// Import the ApiError class for standardized error handling
import ApiError from "../utils/ApiError.js";

// Import the User model for database operations
import { User } from "../models/user.model.js";

// Import the Cloudinary utility for uploading files
import uploadOnCloudinary from "../utils/cloudinary.js";

// Import the ApiResponse class for creating structured API responses
import ApiResponse from "../utils/ApiResponse.js";

// Function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
  // Extract user data from the request body
  const { username, email, fullname, password } = req.body;

  // Check if any of the required fields are empty
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required"); // Throw error if any field is missing
  }

  // Check if a user with the given username or email already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // Match either username or email
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "A user with this email or username already exists"
    );
  }

  // Get the local file path for the avatar image (if uploaded)
  const avatarLocalPath = req.files?.avatar[0]?.path;

  // Variable to store the local file path for the cover image (if uploaded)
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path; // Get the file path if a cover image is uploaded
  }

  // Check if the avatar file was uploaded
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar local path is required");
  }

  // Upload the avatar to Cloudinary and get its URL
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // Upload the cover image to Cloudinary if provided
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Ensure the avatar upload was successful
  if (!avatar) {
    throw new ApiError(400, "Avatar on Cloudinary is required");
  }

  // Create a new user in the database
  const user = await User.create({
    username: username.toLowerCase(), // Store the username in lowercase
    email,
    fullname,
    avatar: avatar?.url, // Save the Cloudinary URL of the avatar
    coverImage: coverImage?.url || "", // Save the cover image URL or an empty string if not provided
    password, // Save the hashed password (handled by pre-save middleware in the model)
  });

  // Fetch the newly created user, excluding sensitive fields (password and refreshToken)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // If the user creation fails, throw an error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user in DB");
  }

  // Return a success response with the created user's details
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User has been registered successfully")
    );
});

// Function to handle user login
const loginUser = asyncHandler(async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find the user in the database by email
  const registeredUser = await User.findOne({ email });

  // If the user does not exist, throw an error
  if (!registeredUser) {
    throw new ApiError(400, "You are not a registered user");
  }

  // Verify the provided password against the stored hashed password
  const isPasswordValid = await registeredUser.isPasswordCorrect(password);

  // If the password is invalid, throw an error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate an access token for the user
  const accessToken = registeredUser.generateAccessToken();

  // Generate a refresh token for the user
  const refreshToken = registeredUser.generateRefreshToken();

  // Respond with the user's full name and generated tokens
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { fullname: registeredUser.fullname, accessToken, refreshToken },
        "Login successful"
      )
    );
});

// Export the registerUser and loginUser functions for use in routes
export { registerUser, loginUser };

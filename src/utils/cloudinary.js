import { vs as cloudinary } from "cloudinary"; 
// Import the Cloudinary library to handle file uploads to Cloudinary. 
// 'vs' is renamed to 'cloudinary' for easier reference.

import fs from "fs"; 
// Import the Node.js File System (fs) module to handle file operations like deleting local files.

// Configure the Cloudinary client with environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  // Set the Cloudinary cloud name from an environment variable.
  api_key: process.env.CLOUDINARY_API_KEY, 
  // Set the Cloudinary API key from an environment variable.
  api_secret: process.env.CLOUDINARY_API_SECRET, 
  // Set the Cloudinary API secret from an environment variable.
});

const uploadOnCloudinary = async (localFilePath) => {
  // Define an asynchronous function to upload a file to Cloudinary.
  try {
    if (!localFilePath) return null; 
    // If no file path is provided, return null (no upload needed).

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", 
      // Automatically detect the file type (image, video, etc.) for upload.
    });

    console.log("File is uploaded on cloudinary", response.url); 
    // Log a success message and the uploaded file's URL.

    return response; 
    // Return the response object containing details of the uploaded file.
  } catch (error) {
    fs.unlinkSync(localFilePath); 
    // If an error occurs, delete the local file to clean up.

    return null; 
    // Return null to indicate the upload failed.
  }
};

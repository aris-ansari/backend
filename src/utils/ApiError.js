// Defining a custom error class `ApiError` that extends the built-in `Error` class
class ApiError extends Error {
  // Constructor method to initialize an instance of the `ApiError` class
  constructor(
    statusCode, // The HTTP status code representing the type of error (e.g., 404, 500)
    message = "Something went wrong!", // A default error message, if none is provided
    errors = [], // An optional array to hold detailed error information
    stack = "" // An optional custom stack trace
  ) {
    // Calling the parent `Error` class constructor with the error message
    super(message);

    // Setting the HTTP status code for the error
    this.statusCode = statusCode;

    // A placeholder for any additional data to include with the error
    this.data = null;

    // Setting the error message
    this.message = message;

    // Indicating that the operation was not successful
    this.success = false;

    // Storing any additional error details
    this.errors = errors;

    // If a custom stack trace is provided, assign it to the error instance
    if (stack) {
      this.stack = stack;
    } else {
      // Otherwise, capture the current stack trace for debugging purposes
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Exporting the `ApiError` class to make it available for use in other files
export default ApiError;

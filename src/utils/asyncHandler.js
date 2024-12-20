// Defining a utility function `asyncHandler` to handle asynchronous code in Express routes
// This function ensures that errors from async route handlers are properly caught and passed to the next middleware

// Using try-catch (commented out) - An alternative approach to handle async errors within try-catch blocks
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next); // Executes the passed async function
//   } catch (error) {
//     // If an error occurs, send a response with the error message and status code
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Using Promise (active approach) - A more concise way to handle async errors using promises
const asyncHandler = (fn) => {
  // Return a new function that automatically wraps the provided async function in a promise
  (req, res, next) => {
    // `Promise.resolve` ensures that the async function is always wrapped in a promise
    // If the promise rejects, the error is passed to the next middleware (error handling middleware)
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};

// Exporting the `asyncHandler` function so it can be used in other files to handle async errors in routes
export default asyncHandler;

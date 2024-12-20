// Defining a class `ApiResponse` to structure the response data sent to the client
class ApiResponse {
  // Constructor method to initialize an instance of the `ApiResponse` class
  constructor(statusCode, data, message = "Success") {
    // The HTTP status code for the response (e.g., 200 for success, 404 for not found)
    this.statusCode = statusCode;

    // The data to be included in the response (e.g., user data, list of items)
    this.data = data;

    // A message to describe the result of the operation, defaulting to "Success"
    this.message = message;

    // A flag indicating whether the request was successful
    // If the statusCode is less than 400 (successful status), set `success` to true, otherwise false
    this.success = statusCode < 400;
  }
}

// Exporting the `ApiResponse` class to make it available for use in other files
export default ApiResponse;

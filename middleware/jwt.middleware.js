const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // obtener el payload después de la validación
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

// Middleware to check if the user has admin role
function isAdmin(req, res, next) {
  // Check if the payload contains the role information
  const { payload } = req;
  if (payload && payload.role === "admin") {
    // If the user has admin role, call the next middleware
    next();
  } else {
    // If the user doesn't have admin role, return unauthorized error
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  isAdmin,
};

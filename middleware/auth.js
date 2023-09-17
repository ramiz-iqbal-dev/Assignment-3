
const jwt = require('jsonwebtoken');

// Implement authentication middleware
module.exports = (req, res, next) => {
  try {
    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using your secret key (the same one used for generating tokens)
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key

    // Add user data to the request object
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next(); // Continue to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

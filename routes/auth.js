const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration Route
router.post('/register', async (req, res) => {
  try {
    // Extract user input from request body
    const { username, email, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    // Extract user input from request body
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-secret-key', // Replace with a secret key for JWT
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  try {
    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using your secret key (the same one used for generating tokens)
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Add user data to the request object
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next(); // Continue to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = {
  authRoutes: router,
  authMiddleware,
};

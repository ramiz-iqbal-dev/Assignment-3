module.exports = (err, req, res, next) => {
    console.error(err); // Log the error for debugging (you can customize this part)
  
    if (err.name === 'UnauthorizedError') {
      // Handle JWT authentication errors
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Handle other types of errors
    res.status(500).json({ message: 'Server error' });
  };
  
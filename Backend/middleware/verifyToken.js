const jwt = require('jsonwebtoken');

/**
 * Middleware guard to protect REST API routes using the short-lived access token
 */
const verifyToken = (req, res, next) => {
  // Extract token from the HTTP Authorization header (Format: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or unauthorized' });
  }

  // Verify token signature against your secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Access token is invalid or has expired' });
    }
    
    // Attach decoded user metadata directly to the request object
    req.user = decoded;
    
    // Pass control to the next function in line (the controller)
    next();
  });
};

module.exports = verifyToken;

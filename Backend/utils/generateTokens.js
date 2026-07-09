const jwt = require('jsonwebtoken');

/**
 * Generates both an Access Token (short-lived) and a Refresh Token (long-lived)
 * @param {Object} user - The mongoose user document object
 */
const generateTokens = (user) => {
  // 1. Generate the short-lived access token
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' } // Expires quickly for security
  );

  // 2. Generate the long-lived refresh token
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Stays valid for a week
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;

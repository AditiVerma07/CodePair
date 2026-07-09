const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

// 1. SIGN UP (Register User)
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in MongoDB Atlas
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate both tokens (Split-Token Pattern)
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Securely pack the Refresh Token into an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true only when live on HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' allows cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days matching token lifespan
    });

    // Send the short-lived Access Token to frontend memory
    return res.status(201).json({
      accessToken,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

// 2. LOGIN (Authenticate User)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look up user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate fresh tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Deliver the Refresh Token via HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Deliver Access Token to memory
    return res.status(200).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// 3. REFRESH TOKEN (Silent Rotation)
exports.refresh = async (req, res) => {
  try {
    // Read the HttpOnly cookie automatically passed by the browser
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }

    // Verify token validity
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid session token' });
      }

      // Find user matching the ID inside the token payload
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User no longer exists' });
      }

      // Generate a brand new short-lived access token
      const tokens = generateTokens(user);

      return res.status(200).
      json({ accessToken: tokens.accessToken ,
   user: { id: user._id, name: user.name, email: user.email }
      });
    });

  } catch (error) {
    return res.status(500).json({ message: 'Token rotation failed', error: error.message });
  }
};

// 4. LOGOUT (Invalidate Session)exports.logout = (req, res) => {
 exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' allows cross-domain
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

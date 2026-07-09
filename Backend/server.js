require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// 1. Connect to MongoDB Atlas
connectDB();

const app = express();

// 2. Global Security and Parsing Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // Required to allow HttpOnly refresh token cookies from frontend
}));
app.use(express.json()); // Allows server to read JSON bodies sent in requests
app.use(cookieParser()); // Allows server to read cookies (for our refresh token)

// 3. Health Check Route (To test if the server is awake)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'CodePair backend is running smoothly' 
  });
});

// ADD THIS NEW SECTION HERE:
// 3. Mount REST API Routing Layers
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// 4. Wrap Express Server with HTTP to support WebSockets
const server = http.createServer(app);

// 5. Initialize Socket.io real-time engine
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 6. Real-time Connection Listener (Placeholder for now)
// REPLACE SECTION 6 & 7 WITH THIS:
// 6. Bind real-time tracking business logic modules
const initSocketHandlers = require('./socketHandlers');
initSocketHandlers(io);

// 7. Start the Server engine
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server spinning up on port ${PORT}`);
});

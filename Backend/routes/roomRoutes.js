const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const verifyToken = require('../middleware/verifyToken');

// All room routes require the user to be logged in with a valid access token
router.post('/create', verifyToken, roomController.createRoom);
router.get('/:roomId', verifyToken, roomController.getRoomDetails);

// This route remains exactly the same!
router.post('/:roomId/run', verifyToken, roomController.executeCode);

module.exports = router;

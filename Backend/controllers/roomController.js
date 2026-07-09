// controller/roomController.js
const Room = require('../models/Room');
const crypto = require('crypto');
const axios = require('axios');

// Maps your Monaco selector items to JDoodle's language codes
// JDoodle requires both a "language" string AND a "versionIndex" per language
const JDOODLE_MAPPING = {
  'javascript': { language: 'nodejs', versionIndex: '4' },
  'python':     { language: 'python3', versionIndex: '4' },
  'cpp':        { language: 'cpp17', versionIndex: '1' },
  'java':       { language: 'java', versionIndex: '4' }
};

/**
 * Creates a unique coding room workspace document in MongoDB Atlas
 */
exports.createRoom = async (req, res) => {
  try {
    const uniqueId = `cp-${crypto.randomBytes(4).toString('hex')}`;
    const ownerId = req.user.userId;
    const { language } = req.body;

    const newRoom = await Room.create({
      roomId: uniqueId,
      ownerId: ownerId,
      language: language || 'javascript',
      code: '// Welcome to CodePair! Type your solution or select a language to begin.\n'
    });

    return res.status(201).json({
      message: 'Room created successfully',
      roomId: newRoom.roomId,
      language: newRoom.language,
      ownerId: newRoom.ownerId
    });

  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to create room instance', 
      error: error.message 
    });
  }
};

/**
 * Fetches an existing room's code and settings for page reloads or link sharing
 */
exports.getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Coding room not found or link has expired' });
    }

    return res.status(200).json({
      roomId: room.roomId,
      language: room.language,
      code: room.code,
      ownerId: room.ownerId
    });

  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to retrieve room details', 
      error: error.message 
    });
  }
};

/**
 * Forwards user workspace code to the JDoodle compiler API
 */
exports.executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const target = JDOODLE_MAPPING[language];
    if (!target) {
      return res.status(400).json({ message: 'Unsupported execution runtime language requested.' });
    }

    const response = await axios({
      method: 'post',
      url: 'https://api.jdoodle.com/v1/execute',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        language: target.language,
        versionIndex: target.versionIndex
      }
    });

    const { output, error, statusCode } = response.data;

    return res.status(200).json({
      status: 'Execution Complete',
      stdout: error ? '' : (output || ''),
      stderr: error ? output : '' // JDoodle puts error text inside "output" too, error flag just marks it
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Compiler execution connection failure',
      error: error.response ? JSON.stringify(error.response.data) : error.message
    });
  }
};
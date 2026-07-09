const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Establishes a link back to the User model
    required: true
  },
  language: {
    type: String,
    default: 'javascript',
    enum: ['javascript', 'python', 'cpp', 'java'] // Limits input to supported Monaco languages
  },
  code: {
    type: String,
    default: '// Welcome to CodePair! Start coding here.\n'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Room', RoomSchema);

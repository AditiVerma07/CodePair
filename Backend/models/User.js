const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  avatarUrl: {
    type: String,
    default: '' // Can store custom placeholder profile images for live presence tracking
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields for you
});

module.exports = mongoose.model('User', UserSchema);

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public endpoints
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// مسارات عامة (بدون مصادقة)
router.post('/signup', signup);
router.post('/login', login);

// مسارات تتطلب مصادقة
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
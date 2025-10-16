const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { authMiddleware } = require('../middleware/auth');
const { otp } = require('../models/otp');

// Route pour créer un compte et générer l'OTP
router.post('/register', authController.register);

// Route pour vérifier l'OTP et activer le compte
// router.post('/verify-otp', authController.verifyOtp);

// Route pour se connecter (login)
router.post('/login', authController.login);

module.exports = router;

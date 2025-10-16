const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: Number, required: true },
  purpose: { type: String, enum: ['verify-email', 'reset-password'], required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Otp', otpSchema);

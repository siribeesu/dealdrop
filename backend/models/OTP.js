const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identity: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '10m' } // Automatically delete after 10 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);

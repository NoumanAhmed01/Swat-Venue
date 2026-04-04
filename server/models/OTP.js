const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpType: {
    type: String,
    enum: ["verify", "reset"],
    default: "reset",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

otpSchema.index({ email: 1 });

module.exports = mongoose.model("OTP", otpSchema);

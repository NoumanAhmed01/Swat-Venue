const User = require("../models/User");
const OTP = require("../models/OTP");
const { generateToken, generateResetToken, verifyToken } = require("../utils/jwt");
const { sendOTPEmail, sendVerificationOTPEmail } = require("../config/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "customer",
      isVerified: false, // Force false initially
    });

    // Generate verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, otpType: "verify" });

    // send OTP email
    try {
      await sendVerificationOTPEmail(email, otp, user.name);
    } catch (emailError) {
      console.error("Registration OTP email failed:", emailError.message);
      return res.status(201).json({
        success: true,
        message: "Registration successful, but we couldn't send the verification email. Please use 'Forgot Password' to resend the code.",
        email: user.email,
        emailError: true
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with the OTP sent.",
      email: user.email,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// =============== VERIFY EMAIL (during registration) =================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOTP = await OTP.findOne({ email, otp, otpType: "verify" });
    if (!validOTP) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Set user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // OTP verified → delete it
    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    // 1. FIRST check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. THEN check if account is active and verified
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    if (user.isVerified === false) {
      return res.status(401).json({
        success: false,
        isVerified: false,
        message: "Email not verified. Please verify your email first.",
      });
    }

    // 3. Then check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============== FORGOT PASSWORD (send OTP) =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Determine OTP type: if user not verified, it's a verification OTP, otherwise it's a reset OTP
    const otpType = user.isVerified ? "reset" : "verify";

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // remove previous OTP if exists
    await OTP.deleteMany({ email });

    // save new OTP in DB (auto-expires in 10 min)
    await OTP.create({ email, otp, otpType });

    // send OTP email
    try {
      if (user.isVerified) {
        await sendOTPEmail(email, otp, user.name);
      } else {
        await sendVerificationOTPEmail(email, otp, user.name);
      }
    } catch (emailError) {
      console.error("Forgot Password OTP email failed:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please check your email configuration.",
      });
    }

    res.status(200).json({
      success: true,
      message: user.isVerified 
        ? "OTP sent successfully to your email for password reset." 
        : "Verification OTP resent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== VERIFY OTP (for password reset) =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOTP = await OTP.findOne({ email, otp, otpType: "reset" });
    if (!validOTP) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Generate a secure reset token valid for 15 minutes
    const resetToken = generateResetToken(email);

    // OTP verified → delete it
    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!resetToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please verify OTP first.",
      });
    }

    // Verify the reset token
    const decoded = verifyToken(resetToken);
    if (!decoded || decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User found but email mismatch." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

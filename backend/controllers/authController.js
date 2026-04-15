const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Create user (CORRECT WAY ✅)
    const user = new User({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    await user.save(); // 🔥 triggers password hashing

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    // Check user exists
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // Success
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Error logging in",
      error: err.message,
    });
  }
};

// ================= GET USER INFO =================
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({ user });

  } catch (err) {
    console.log("GET USER ERROR:", err);
    res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};
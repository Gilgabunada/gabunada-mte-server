const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to register user.", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed.", error: err.message });
  }
};
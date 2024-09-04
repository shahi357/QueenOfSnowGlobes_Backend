const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register a new user
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    // Default to 'user' role if not specified
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
    });
    await newUser.save();
    req.session.userId = newUser._id;
    res.status(201).json({ userId: newUser._id, role: newUser.role });
    console.log("New user created successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    req.session.userId = user._id;
    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    });
    console.log("Login Successful.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require('../utils/authentication');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ status: "Active" });
  res.status(200).json(users);
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
    res.status(400);
    throw new Error("Please add all the required fields");
  }

  // Check if user already exists by email or username
  const userData = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (userData) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user instance
  const user = new User({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
  });

  // Save user to DB
  await user.save();
  console.log(user);

  res.status(201).json({success: true, _id: user._id });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user email
  const user = await User.findOne({
    $or: [{ email: username }, { username: username }],
  }).lean();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.json({
    success: true,
    user: user,
    accessToken: generateToken(user),
  });
});

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};

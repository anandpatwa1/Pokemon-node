const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const getUser = (req, res) => {
  try {
    const sendUser = {
      _id : req.user._id,
      email : req.user.email,
      created_at : req.user.created_at,
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      mobile_number : req.user.mobile_number,
      country_code : req.user.country_code,
      address : req.user.address,
      savedToken : req.user.token
    }
    res.status(200).json({ status: true, message: "Successful", user:sendUser });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      mobile_number,
      country_code,
      address,
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      mobile_number,
      country_code,
      address,
    });

    // Save the user to the database
    await newUser.save();

    const sendUser = {
      _id : newUser._id,
      email : newUser.email,
      created_at : newUser.created_at,
      first_name : newUser.first_name,
      last_name : newUser.last_name,
      mobile_number : newUser.mobile_number,
      country_code : newUser.country_code,
      address : newUser.address
    }
    res
      .status(201)
      .json({
        status: true,
        message: "User created successfully",
        user: sendUser,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "90d",
    });

    // Store the token in the user's token array
    user.token = user.token || [];
    user.token.push(token);
    await user.save();

    const sendUser = {
      _id : user._id,
      email : user.email,
      created_at : user.created_at,
      first_name : user.first_name,
      last_name : user.last_name,
      mobile_number : user.mobile_number,
      country_code : user.country_code,
      address : user.address
    }

    res.status(200).json({ status: true, message: "Login successful", user:sendUser, token });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    // Remove the token from the user's token array
    req.user.token = req.user.token.filter((userToken) => userToken !== token);

    await req.user.save();

    res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, mobile_number, country_code, address, password } = req.body;

    // Find the user by ID
    const user = req.user;

    // Update user fields
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (mobile_number) user.mobile_number = mobile_number;
    if (country_code) user.country_code = country_code;
    if (address) user.address = address;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Update profile image if uploaded
    if (req.file) {
      // Delete old profile image if it exists
      if (user.profile_image) {
        const oldImagePath = path.join(__dirname, '..', user.profile_image); // Construct the correct path
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.log('Failed to delete old profile image:', err);
          }
        });
      }

      // Update to new profile image
      user.profile_image = `images/user/${req.file.filename}`; // Use relative path
    }
    await user.save();

    res.status(200).json({ status: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error', error });
  }
}

const logoutAll = async (req, res) => {
  try {
    const user = req.user;

    // Clear all tokens
    user.token = [];

    await user.save();

    res.status(200).json({ status: true, message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error', error });
  }
}

module.exports = { createUser, loginUser, getUser, logout,updateUser, logoutAll };

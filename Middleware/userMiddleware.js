const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

// Middleware to authenticate the token
const authenticateuser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: false, message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ status: false, message: 'User not found' });
    }

    if (!user.token.includes(token)) {
      return res.status(401).json({ status: false, message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ status: false, message: 'Token verification failed' });
  }
};


module.exports = {authenticateuser};

// .json({status:false, message: 'Token not provided' });
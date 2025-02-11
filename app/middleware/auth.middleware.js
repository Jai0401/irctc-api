// app/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const db = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing!' });
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    const user = await db.User.findByPk(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: 'User not found!' });
    }

    req.user = user;
    next();
  } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: 'Token expired. Please log in again.'});
      }
      return res.status(401).json({ message: 'Token is invalid!' });
  }
};

module.exports = { authenticateToken };
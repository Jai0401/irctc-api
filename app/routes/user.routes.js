// app/routes/user.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const db = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateRegisterUser, validateLoginUser } = require('../utils/validation')
const { validationResult } = require('express-validator');

// Register User
router.post('/register', validateRegisterUser, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  const { username, password } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({ username, password: hashedPassword });
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', validateLoginUser, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { username, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ sub: user.id }, config.secretKey, { expiresIn: '24h' });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userDetails = {
            id: req.user.id,
            username: req.user.username,
            isAdmin: req.user.isAdmin,
        };
        res.json(userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
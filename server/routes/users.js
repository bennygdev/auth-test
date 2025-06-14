const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { check, validationResult } = require('express-validator');
const { validateToken, isModerator, isAdmin } = require('../middlewares/auth');
const { redisClient } = require('../server');
const { Op } = require('sequelize');

require("dotenv").config();

router.post(
  '/register',
  [
    // Validation
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => ({ ...err, param: err.path })) });
    }

    const { firstName, lastName, username, email, password } = req.body;

    try {
      // Check if user exists
      let userByEmail = await User.findOne({ where: { email } });
      if (userByEmail) {
        return res.status(400).json({ msg: 'User with that email already exists' });
      }
      
      let userByUsername = await User.findOne({ where: { username } });
      if (userByUsername) {
        return res.status(400).json({ msg: 'Username is already taken' });
      }

      // Hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password: hashedPassword,
      });

      // JWT
      const payload = {
        user: {
          id: user.user_id,
          username: user.username
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_default_jwt_secret',
        { expiresIn: '2h' }, // Token expires in 2 hours
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: payload.user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/login',
  [
    check('usernameEmail', 'Email or Username is required').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => ({ ...err, param: err.path })) });
    }

    const { usernameEmail, password } = req.body;

    try {
      let user = await User.findOne({
        where: {
          [Op.or]: [
            { email: usernameEmail },
            { username: usernameEmail }
          ]
        }
      });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Google check
      if (!user.password && user.googleId) {
        return res.status(400).json({ msg: 'This account was created using Google. Please sign in with Google.' });
      }
      
      // For regular accounts
      if (!user.password) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // JWT
      const payload = {
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_default_jwt_secret',
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: payload.user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/logout', validateToken, async (req, res) => {
  try {
    const token = req.token;
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

    if (remainingTime <= 0) {
      return res.status(200).json({ msg: 'Token already expired.' });
    }
    
    // Add token to Redis blocklist
    await redisClient.set(`blocklist:${token}`, 'blocked', {
      EX: remainingTime,
    });

    res.status(200).json({ msg: 'You have been logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/authtest', validateToken, (req, res) => {
  const { role } = req.user;
  res.json({
    message: `Welcome! Your role is ${role}.`,
    role: role,
  });
});

// Fetch current user data using token
router.get('/me', validateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'username', 'email', 'role'] // fields to return
    });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
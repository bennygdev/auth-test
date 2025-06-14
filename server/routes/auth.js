const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

// Helper to generate JWT
const generateToken = (user) => {
  const payload = { user: { id: user.user_id, username: user.username, role: user.role } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_BASE_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
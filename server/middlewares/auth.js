const jwt = require('jsonwebtoken');
const { redisClient } = require('../server');
require('dotenv').config();

const validateToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Check if the token is in the Redis blocklist
    const isBlocked = await redisClient.get(`blocklist:${token}`);
    if (isBlocked) {
      return res.status(401).json({ msg: 'Token has been invalidated. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    
    req.user = decoded.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const isModerator = (req, res, next) => {
  if (req.user && (req.user.role === 'Moderator' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ msg: 'Moderator or Admin role required' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Admin role required' });
  }
};

module.exports = { validateToken, isModerator, isAdmin };
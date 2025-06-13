const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret');
    
    req.user = decoded.user;
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
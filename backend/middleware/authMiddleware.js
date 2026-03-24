const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.blockDemoWrites = (req, res, next) => {
  if (req.user && req.user.username === 'demo@alarmpro.com') {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return res.status(403).json({ error: 'Demo Mode: Changes are not saved.' });
    }
  }
  next();
};

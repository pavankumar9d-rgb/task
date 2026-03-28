const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, blockDemoWrites } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/genre', verifyToken, blockDemoWrites, authController.updateGenre);
router.get('/check-email', (req, res) => {
  const { email } = req.query;
  const db = require('../models/db');
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    res.json({ exists: !!row });
  });
});

module.exports = router;

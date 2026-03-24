const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password, genre } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (password.length < 4) return res.status(400).json({ error: 'Password too short' });

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    
    db.run(
      'INSERT INTO users (id, username, password, genre, is_premium) VALUES (?, ?, ?, ?, ?)',
      [id, username, hashedPass, genre || 'student', 0],
      function(err) {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        const token = jwt.sign({ id, username, is_premium: 0 }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ id, username, genre: genre || 'student', is_premium: 0, token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // Demo Mode override
  if (username === 'demo@alarmpro.com' && password === '123456') {
    const token = jwt.sign({ id: 'demo123', username, is_premium: 1 }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.json({ id: 'demo123', username, genre: 'student', is_premium: 1, token, isDemo: true });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    // Backwards compatibility for plain text passwords in existing local DB
    const match = user.password === password || await bcrypt.compare(password, user.password).catch(()=>false);
    if (!match) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username, is_premium: user.is_premium }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ id: user.id, username: user.username, genre: user.genre, is_premium: user.is_premium, token });
  });
};

exports.updateGenre = (req, res) => {
  const { genre } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  db.run('UPDATE users SET genre = ? WHERE id = ?', [genre, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true, genre });
  });
};

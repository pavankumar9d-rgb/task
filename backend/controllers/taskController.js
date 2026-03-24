const db = require('../models/db');

exports.getTasks = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  // Demo Mode mock data
  if (req.user.username === 'demo@alarmpro.com') {
    return res.json([
      { id: 't1', title: 'Buy AlarmPro', desc: 'Acquire this ready-to-sell startup', category: 'Study Session', date: new Date().toISOString().split('T')[0], time: '14:30', triggered: false, completedAt: null }
    ]);
  }

  db.all('SELECT * FROM tasks WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
};

exports.createTask = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  // Premium Limit Check
  db.get('SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND completedAt IS NULL', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (req.user.is_premium === 0 && row.count >= 3) {
      return res.status(403).json({ error: 'FREE_LIMIT_REACHED' });
    }

    const t = req.body;
    db.run(
      `INSERT OR REPLACE INTO tasks (id, userId, title, desc, category, date, time, triggered, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, req.user.id, t.title, t.desc, t.category, t.date, t.time, t.triggered ? 1 : 0, t.completedAt],
      function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
};

exports.clearHistory = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  db.run('DELETE FROM tasks WHERE userId = ? AND completedAt IS NOT NULL', [req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
};

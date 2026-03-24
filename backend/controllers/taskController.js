const db = require('../models/db');

exports.getTasks = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  console.log('--- GET /api/tasks for user:', req.user.id);

  db.all('SELECT * FROM tasks WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) {
      console.error('❌ GET /api/tasks DB Error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows || []);
  });
};

exports.createTask = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  // Premium Limit Check
  db.get('SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND completedAt IS NULL', [req.user.id], (err, row) => {
    if (err) {
      console.error('❌ POST /api/tasks (Count) DB Error:', err.message);
      return res.status(500).json({ error: 'Database error (count): ' + err.message });
    }
    
    if (req.user.is_premium === 0 && row.count >= 3) {
      return res.status(403).json({ error: 'FREE_LIMIT_REACHED' });
    }

    const t = req.body;
    db.run(
      `INSERT OR REPLACE INTO tasks (id, userId, title, desc, category, date, time, triggered, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, req.user.id, t.title, t.desc, t.category, t.date, t.time, t.triggered ? 1 : 0, t.completedAt],
      function(err) {
        if (err) {
          console.error('❌ POST /api/tasks (Insert) DB Error:', err.message);
          return res.status(500).json({ error: 'Database error (insert): ' + err.message });
        }
        res.json({ success: true });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      console.error('❌ DELETE /api/tasks/:id DB Error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ success: true });
  });
};

exports.clearHistory = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  db.run('DELETE FROM tasks WHERE userId = ? AND completedAt IS NOT NULL', [req.user.id], function(err) {
    if (err) {
      console.error('❌ DELETE /api/tasks/history/all DB Error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ success: true });
  });
};

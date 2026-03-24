const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Database Setup ────────────────────────────────────────────────────────────
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) return console.error('DB Error:', err.message);
    console.log('Connected to the SQLite database.');

    db.serialize(() => {
        // Users table (simple username-based auth, no password hashing for offline local app)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            genre TEXT DEFAULT 'student',
            createdAt TEXT DEFAULT (datetime('now'))
        )`);

        // Tasks keyed by user
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id          TEXT PRIMARY KEY,
            user_id     INTEGER,
            title       TEXT,
            desc        TEXT,
            category    TEXT,
            date        TEXT,
            time        TEXT,
            triggered   BOOLEAN DEFAULT 0,
            completedAt TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    });
});

// ─── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
    const { username, password, genre } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    db.run(
        `INSERT INTO users (username, password, genre) VALUES (?, ?, ?)`,
        [username.trim(), password, genre || 'student'],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already taken' });
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, username: username.trim(), genre: genre || 'student' });
        }
    );
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid username or password' });
        res.json({ id: row.id, username: row.username, genre: row.genre });
    });
});

app.put('/api/auth/genre', (req, res) => {
    const { userId, genre } = req.body;
    db.run(`UPDATE users SET genre = ? WHERE id = ?`, [genre, userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Genre updated', genre });
    });
});

// ─── Task Routes ───────────────────────────────────────────────────────────────
app.get('/api/tasks', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => ({ ...r, triggered: r.triggered === 1 })));
    });
});

app.post('/api/tasks', (req, res) => {
    const { id, userId, title, desc, category, date, time, triggered, completedAt } = req.body;
    db.run(
        `INSERT OR REPLACE INTO tasks (id, user_id, title, desc, category, date, time, triggered, completedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, title, desc, category || '', date, time, triggered ? 1 : 0, completedAt || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, message: 'Task saved' });
        }
    );
});

app.delete('/api/tasks/:id', (req, res) => {
    const { userId } = req.query;
    if (req.params.id === 'history') {
        db.run(`DELETE FROM tasks WHERE user_id = ? AND completedAt IS NOT NULL`, [userId], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'History cleared' });
        });
    } else {
        db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [req.params.id, userId], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Deleted' });
        });
    }
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error('DB Error:', err.message); return; }
  console.log('Connected to SQLite:', dbPath);
  // WAL mode: allows concurrent reads + writes without SQLITE_BUSY errors
  db.run('PRAGMA journal_mode=WAL;');
  db.run('PRAGMA busy_timeout=5000;'); // wait up to 5s if DB is locked
});

db.serialize(() => {
  // 1. Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    genre TEXT,
    is_premium INTEGER DEFAULT 0
  )`);
  
  // Migration: is_premium
  db.run('ALTER TABLE users ADD COLUMN is_premium INTEGER DEFAULT 0', (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration Note (users):', err.message);
    }
  });

  // 2. Tasks Table
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    userId TEXT,
    title TEXT,
    desc TEXT,
    category TEXT,
    date TEXT,
    time TEXT,
    triggered INTEGER,
    completedAt TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  // Migration: userId
  db.run('ALTER TABLE tasks ADD COLUMN userId TEXT', (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration Note (tasks):', err.message);
    }
  });

  // 3. Demo User (Must be safe at end of serialize)
  const demoId = 'demo123';
  db.get('SELECT id FROM users WHERE id = ?', [demoId], (err, row) => {
    if (!row && !err) {
      db.run('INSERT INTO users (id, username, password, genre, is_premium) VALUES (?, ?, ?, ?, ?)', 
             [demoId, 'demo@alarmpro.com', '123456', 'student', 1], (insertErr) => {
               if (insertErr) console.error('❌ Demo user insert failed:', insertErr.message);
               else console.log('✅ Demo user ready.');
             });
    } else if (row) {
      console.log('✅ Demo user exists.');
    }
  });
});

module.exports = db;

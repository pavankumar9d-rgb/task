const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root route - Landing Page (MUST BE ABOVE static middleware or index.html overrides it)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/landing.html'));
});

// Serve static compiled frontend PWA
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Primary App Route
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SaaS AlarmPro Backend running at http://localhost:${PORT}`);
});

// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./leaderboard.db');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nickname TEXT,
    score INTEGER DEFAULT 0,
    rank INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API Routes
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY rank ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { name, nickname } = req.body;
  db.run(
    'INSERT INTO students (name, nickname, rank) SELECT ?, ?, COALESCE(MAX(rank), 0) + 1 FROM students',
    [name, nickname],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/students/rank', (req, res) => {
  const { rankings } = req.body;
  db.serialize(() => {
    const stmt = db.prepare('UPDATE students SET rank = ? WHERE id = ?');
    rankings.forEach((item, index) => {
      stmt.run(index + 1, item.id);
    });
    stmt.finalize();
    res.json({ success: true });
  });
});

app.put('/api/students/:id/score', (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  db.run(
    'UPDATE students SET score = ? WHERE id = ?',
    [score, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Express backend for DrapeAI Waitlist
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

// SQLite DB setup
const db = new Database(path.join(__dirname, 'waitlist.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS visit_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visit_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS submission_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visit_id TEXT,
  email TEXT,
  phone TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS waitlist_number (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  count INTEGER
);

-- Ensure at least one row exists in waitlist_number
INSERT INTO waitlist_number (count)
SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM waitlist_number);
`);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));

// API: Get current waitlist number
app.get('/api/waitlist/count', (req, res) => {
  let row = db.prepare('SELECT count FROM waitlist_number WHERE id = 1').get();
  if (!row) {
    db.prepare('INSERT INTO waitlist_number (id, count) VALUES (1, 0)').run();
    row = { count: 0 };
  }
  res.json({ waitlist_number: row.count });
});

// API: Geo IP (Mock/Basic)
app.get('/api/geo', (req, res) => {
  res.json({
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
  });
});

// API: Record a visit
app.post('/api/visit', (req, res) => {
  const {
    visit_id,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, user_agent, ip
  } = req.body;
  db.prepare(`INSERT INTO visit_details (
    visit_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, user_agent, ip
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      visit_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      referrer, user_agent, ip
    );
  // Get current waitlist number
  const row = db.prepare('SELECT count FROM waitlist_number WHERE id = 1').get();
  res.json({ waitlist_number: row ? row.count : 0 });
});

// API: Waitlist submission
app.post('/api/waitlist', (req, res) => {
  const {
    visit_id,
    email,
    phone,
    user_agent,
    ip
  } = req.body;
  db.prepare(`INSERT INTO submission_details (
    visit_id, email, phone, user_agent, ip
  ) VALUES (?, ?, ?, ?, ?)`)
    .run(visit_id, email, phone, user_agent, ip);
  // Ensure waitlist_number row exists
  let row = db.prepare('SELECT count FROM waitlist_number WHERE id = 1').get();
  if (!row) {
    db.prepare('INSERT INTO waitlist_number (id, count) VALUES (1, 0)').run();
    row = { count: 0 };
  }
  // Increment waitlist_number
  db.prepare('UPDATE waitlist_number SET count = count + 1 WHERE id = 1').run();
  // Get updated waitlist number
  row = db.prepare('SELECT count FROM waitlist_number WHERE id = 1').get();
  res.json({ waitlist_number: row ? row.count : 0 });
});

// API: Proxy for IP (no geo) using ipify
app.get('/api/geo', async (req, res) => {
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const data = await ipRes.json();
    res.json({ ip: data.ip });
  } catch (e) {
    res.json({ ip: '' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

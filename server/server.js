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
  ip_details TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS submission_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visit_id TEXT,
  email TEXT,
  phone TEXT,
  user_agent TEXT,
  ip TEXT,
  ip_details TEXT,
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

// API: Get IP and Geo details from external service
app.get('/api/geo', async (req, res) => {
  try {
    // Step 1: Get IP address from ipify.org
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    const userIP = ipData.ip; // This is the user's public IP
    
    // Step 2: Get geo-location details using the IP from ipapi.co
    const geoEndpoint = `https://ipapi.co/${userIP}/json/`;
    const geoRes = await fetch(geoEndpoint);
    const geoData = await geoRes.json();
    
    // Structure ip_details with endpoint and response
    const ipDetailsStructured = {
      endpoint: geoEndpoint,
      response: geoData
    };
    
    // Return IP as plain string and ip_details as structured JSON
    res.json({ 
      ip: userIP, // Just the IP address string
      ip_details: JSON.stringify(ipDetailsStructured), // Structured with endpoint and response
      raw: geoData // Also send raw for debugging if needed
    });
  } catch (e) {
    console.error('Error fetching IP/Geo data:', e);
    // Fallback: try to get basic IP from request headers
    const fallbackIP = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.socket.remoteAddress || 
                       'unknown';
    
    // Structure fallback ip_details with endpoint and error response
    const fallbackDetails = {
      endpoint: 'fallback',
      response: { ip: fallbackIP, error: 'Could not fetch geo data' }
    };
    
    res.json({ 
      ip: fallbackIP,
      ip_details: JSON.stringify(fallbackDetails)
    });
  }
});

// API: Record a visit
app.post('/api/visit', (req, res) => {
  const {
    visit_id,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, user_agent, ip, ip_details
  } = req.body;
  db.prepare(`INSERT INTO visit_details (
    visit_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, user_agent, ip, ip_details
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      visit_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      referrer, user_agent, ip, ip_details
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
    ip,
    ip_details
  } = req.body;
  db.prepare(`INSERT INTO submission_details (
    visit_id, email, phone, user_agent, ip, ip_details
  ) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(visit_id, email, phone, user_agent, ip, ip_details);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

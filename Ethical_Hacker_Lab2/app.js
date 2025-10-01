const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const DB_PATH = './data/vulnshop.db';
const INIT_SQL = './init_db.sql';

// Check if the data directory exists, if not, create it
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// Initialize the database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  const dbFile = new sqlite3.Database(DB_PATH);
  const init = fs.readFileSync(INIT_SQL, 'utf8');
  dbFile.exec(init, (err) => {
    if (err) console.error('DB init error:', err);
    dbFile.close();
  });
}

const db = new sqlite3.Database(DB_PATH);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// Serve the index.html file for the homepage.
// The client-side JavaScript will handle the rendering of the welcome message.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Serve other dynamic routes with the content from the original app
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  // INTENTIONAL VULNERABILITY: concatenated SQL string
  const sql = `SELECT id, name, description, price FROM products WHERE name LIKE '%${q}%' OR description LIKE '%${q}%'`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send('DB error');
    res.send(`<h2>Search results for ${q}</h2><pre>${JSON.stringify(rows, null, 2)}</pre>`);
  });
});

app.get('/login', (req, res) => {
  res.send(`<form method="POST"><input name="username"/><input name="password"/><button>Login</button></form>`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // INTENTIONAL: no prepared statements, and plaintext comparison
  const sql = `SELECT id,username FROM users WHERE username='${username}' AND password='${password}'`;
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).send('DB error');
    if (row) {
      res.cookie('user', row.username, { httpOnly: true });
      res.send(`<p>Welcome ${row.username} — go to /admin if you are admin</p>`);
    } else {
      res.status(401).send('Invalid');
    }
  });
});

app.get('/admin', (req, res) => {
  const user = req.cookies.user;
  if (user !== 'admin') return res.status(403).send('Forbidden');
  // Show a fake customer table and a 'marker' file for persistence detection
  res.send(`<h1>Admin Dashboard</h1>
    <p>Customers table: (simulated)</p>
    <pre>[{"id":1,"name":"C. Example","email":"cust@example.test"}]</pre>
    <p>Persistence marker file present: ${fs.existsSync('./data/persistence_marker') ? 'YES' : 'NO'}</p>`);
});

app.get('/place_marker', (req, res) => {
  fs.writeFileSync('./data/persistence_marker', 'marker');
  res.send('marker placed');
});

app.listen(3000, () => console.log('VulnShop listening on 3000'));

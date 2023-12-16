const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const shortId = require('shortid');
const validUrl = require('valid-url');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const dbFilePath = path.join(__dirname, 'db.sqlite'); // SQLite database file path

const db = new sqlite3.Database(dbFilePath);
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      originalUrl TEXT NOT NULL,
      shortUrl TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      tags TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
});

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your actual allowed origin
  credentials: true, // Enable credentials (cookies, HTTP authentication)
};


app.use(cookieParser()); 
app.use(express.json());
app.use(cors(corsOptions));

app.post('/generate', async (req, res) => {
  const url = req.body.originalUrl;
  let urlId = '';
  const isValid = validUrl.isUri(url);
  console.log(isValid);

  if (isValid !== undefined) {
    try {
      urlId = shortId.generate();
      res.send(urlId);
    } catch (err) {
      console.log('err' + err);
    }
  } else {
    res.send('false');
    return;
  }
});




app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).json('Username and password are required');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json('Server error');
    } else {
      return res.status(201).json('User registered successfully');
    }
  });
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).json('Username and password are required');
  }

  // Check if the user exists
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json('Server error');
    }

    if (!user) {
      return res.status(401).json('Invalid username or password');
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your-secret-key', {
      expiresIn: '5m', // Set expiration time for the token
    });

    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 300000 }); 

    return res.status(200).json('Login successful');
  });
});


// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');

  return res.status(200).json('Logout successful');
});



app.get('/checkToken', (req, res) => {
  const token = req.cookies.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json('Token not provided');
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json('Invalid token');
    }

    // Token is valid, include username in the response
    const { username } = decoded;
    return res.status(200).json({ username });
  });
});





app.post('/insert', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const shortUrl = req.body.shortUrl || shortId.generate();
  const tags = req.body.tags || ''; // Assume tags are provided as a comma-separated string
  const date = new Date().toISOString();

  db.run(
    'INSERT INTO urls (originalUrl, shortUrl, tags, date) VALUES (?, ?, ?, ?)',
    [originalUrl, shortUrl, tags, date],
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).json('Server error');
      } else {
        console.log('saved to db');
        res.redirect('/');
      }
    }
  );
});



app.post('/search', (req, res) => {
  const tags = req.body.tags;

  let query = 'SELECT * FROM urls';


  if (tags && tags.length > 0) {
    const tagArray = tags.split(',');
    const tagConditions = tagArray.map((tag) => `tags LIKE '%${tag}%'`).join(' AND ');
    query += ` WHERE ${tagConditions}`;
  }

  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json('Server error');
    } else {
      res.send(rows);
    }
  });
});





app.get('/read', (req, res) => {
  db.all('SELECT * FROM urls', (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json('Server error');
    } else {
      res.send(rows);
    }
  });
});

app.get('/:route', (req, res) => {
  const route = req.params.route;
  db.get('SELECT * FROM urls WHERE shortUrl = ?', [route], (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).json('Server error');
    } else if (row) {
      db.run('UPDATE urls SET clicks = clicks + 1 WHERE id = ?', [row.id], (updateErr) => {
        if (updateErr) {
          console.log(updateErr);
        }
      });
      res.redirect(row.originalUrl);
    } else {
      res.status(404).json('No url found');
    }
  });
});

app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM urls WHERE shortUrl = ?', [id], function (err) {
    if (err) {
      console.log(err);
      res.status(500).json('Server error');
    } else if (this.changes > 0) {
      res.json('URL deleted successfully');
    } else {
      res.status(404).json('URL not found');
    }
  });
});




app.listen(5000, () => {
  console.log('server running on port 5000');
});

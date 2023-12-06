const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const shortId = require('shortid');
const validUrl = require('valid-url');
require('dotenv').config();

const app = express();
const dbFilePath = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(cors());

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

app.post('/insert', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const shortUrl = req.body.shortUrl || shortId.generate();
  const clicks = 0;
  const date = new Date();

  const urlObject = {
    originalUrl,
    shortUrl,
    clicks,
    date,
  };

  try {
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    dbData.urls.push(urlObject);
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    console.log('saved to db');
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

app.get('/read', (req, res) => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    res.send(dbData.urls);
  } catch (err) {
    res.status(500).json('Server error');
  }
});

app.get('/:route', (req, res) => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    const url = dbData.urls.find((entry) => entry.shortUrl === req.params.route);

    if (url) {
      url.clicks++;
      fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error');
  }
});

app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  try {
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    const index = dbData.urls.findIndex((entry) => entry.shortUrl === id);

    if (index !== -1) {
      dbData.urls.splice(index, 1);
      fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
      res.json('URL deleted successfully');
    } else {
      res.status(404).json('URL not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error');
  }
});



app.listen(5000, () => {
  console.log('server running on port 5000');
});

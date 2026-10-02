require('dotenv').config(); // loads JWT_SECRET from server/.env
const http = require('http');
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const initRealtime = require('./index');
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'test')));
app.get('/dev-token', (req, res) => {
  const name = req.query.name || 'Guest';
  const role = req.query.role || 'member';
  const token = jwt.sign(
    { id: name.toLowerCase(), name: name, role: role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});
initRealtime(server);
server.listen(5000, () => {
  console.log('Realtime dev server on http://localhost:5000');
});
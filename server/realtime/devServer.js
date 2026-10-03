require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const initRealtime = require('./index');
const connectDB = require('./db');
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
connectDB().catch((err) => console.error('MongoDB error:', err.message));
server.listen(5000, () => {
  console.log('Realtime dev server on http://localhost:5000');
});
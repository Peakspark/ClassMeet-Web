const http = require('http');
const path = require('path');
const express = require('express');
const initRealtime = require('./index');
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'test')));
initRealtime(server);
server.listen(5000, () => {
  console.log('Realtime dev server on http://localhost:5000');
});
const { Server } = require('socket.io');
const socketAuth = require('./socketAuth');


function initRealtime(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });
  io.use(socketAuth);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.name, '(' + socket.user.role + ')', socket.id);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.name);
    });
  });
return io;
}
module.exports = initRealtime;
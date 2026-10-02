const { Server } = require('socket.io');
function initRealtime(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
return io;
}
module.exports = initRealtime;
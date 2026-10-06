const { Server } = require('socket.io');
const socketAuth = require('./socketAuth');
const registerPresenceHandlers = require('./presenceHandlers');
const registerRoomHandlers = require('./roomHandlers');
const { registerChatHandlers, sendHistory } = require('./chatHandlers');
function initRealtime(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' } });
  io.use(socketAuth);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.name, '(' + socket.user.role + ')', socket.id);
    registerPresenceHandlers(io, socket);           //presence
    registerRoomHandlers(io, socket, sendHistory);  //rooms 
    registerChatHandlers(io, socket);               //chat
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.name, socket.id);
    });
  });
  return io;
}
module.exports = initRealtime;
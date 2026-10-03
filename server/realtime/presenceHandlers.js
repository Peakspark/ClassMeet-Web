const presence = require('./presence');
function registerPresenceHandlers(io, socket) {
  const user = socket.user; 
  const entry = presence.addUser(user, socket.id);

  socket.emit('presence:list', presence.getList());
  socket.broadcast.emit('presence:update', presence.toPublic(entry));
  socket.on('presence:set', (status) => {
    const updated = presence.setStatus(user.id, status);
    if (!updated) return; 
    io.emit('presence:update', presence.toPublic(updated));
  });
  socket.on('disconnect', () => {
    const isOffline = presence.removeSocket(user.id, socket.id);
    if (isOffline) {
      io.emit('presence:offline', { id: user.id });
    }
  });
}
module.exports = registerPresenceHandlers;
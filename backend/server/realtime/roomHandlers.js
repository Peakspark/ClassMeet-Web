const ROOM_ID_PATTERN = /^[a-zA-Z0-9_-]{1,50}$/;
async function getUsersInRoom(io, roomId) {
  const sockets = await io.in(roomId).fetchSockets();
  const users = new Map();
  sockets.forEach((s) => users.set(s.data.user.id, s.data.user));
  return Array.from(users.values());
}
async function broadcastRoomUsers(io, roomId) {
  const users = await getUsersInRoom(io, roomId);
  io.to(roomId).emit('room:users', { roomId, users });
}
async function leaveCurrentRoom(io, socket) {
  const roomId = socket.data.roomId;
  if (!roomId) return;

  socket.leave(roomId);
  socket.data.roomId = null;
  await broadcastRoomUsers(io, roomId);
}
function registerRoomHandlers(io, socket, onJoin) {
  socket.data.user = socket.user;
  socket.data.roomId = null; 
  socket.on('room:join', async (roomId) => {
    if (typeof roomId !== 'string' || !ROOM_ID_PATTERN.test(roomId)) {
      socket.emit('room:error', 'Invalid room id');
      return;
    }
    if (socket.data.roomId === roomId) return; 
    await leaveCurrentRoom(io, socket);
    socket.join(roomId);
    socket.data.roomId = roomId;
    await broadcastRoomUsers(io, roomId);
    if (onJoin) await onJoin(socket, roomId);
  });
  socket.on('room:leave', () => leaveCurrentRoom(io, socket));
  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (roomId) broadcastRoomUsers(io, roomId);
  });
}
module.exports = registerRoomHandlers;
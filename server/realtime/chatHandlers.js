const Message = require('./Message');
const MAX_LENGTH = 1000;
function toPublic(m) {
  return {
    id: m._id.toString(),
    roomId: m.roomId,
    senderId: m.senderId,
    senderName: m.senderName,
    text: m.text,
    createdAt: m.createdAt
  };}
async function sendHistory(socket, roomId) {
  try {
    const latest = await Message.find({ roomId })
      .sort({ createdAt: -1 }) 
      .limit(50)
      .lean();
    socket.emit('chat:history', latest.reverse().map(toPublic)); 
  } catch (err) {
    console.error('Could not load history:', err.message);}}
function registerChatHandlers(io, socket) {
  socket.on('chat:send', async (text) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      socket.emit('chat:error', 'Join a room first');
      return;
    }
    if (typeof text !== 'string') return;
    const clean = text.trim();
    if (clean.length === 0 || clean.length > MAX_LENGTH) {
      socket.emit('chat:error', 'Message must be 1 to 1000 characters');
      return;
    }
    try {
      const saved = await Message.create({roomId: roomId,senderId: socket.user.id,senderName: socket.user.name,text: clean});
      io.to(roomId).emit('chat:new', toPublic(saved));
    } catch (err) {console.error('Could not save message:', err.message);socket.emit('chat:error', 'Message could not be saved');}
  });
}
module.exports = { registerChatHandlers, sendHistory };
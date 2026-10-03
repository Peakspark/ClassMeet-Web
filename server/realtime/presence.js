const onlineUsers = new Map();
const VALID_STATUSES = ['online', 'available', 'in-meeting'];
function addUser(user, socketId) {
  let entry = onlineUsers.get(user.id);
  if (!entry) {
    entry = {
      id: user.id,
      name: user.name,
      role: user.role,
      status: 'online',
      sockets: new Set() 
    };
    onlineUsers.set(user.id, entry);
  }
  entry.sockets.add(socketId);
  return entry;
}
function removeSocket(userId, socketId) {
  const entry = onlineUsers.get(userId);
  if (!entry) return false;

  entry.sockets.delete(socketId);

  if (entry.sockets.size === 0) {
    onlineUsers.delete(userId);
    return true;
  }
  return false;
}
function setStatus(userId, status) {
  const entry = onlineUsers.get(userId);
  if (!entry || !VALID_STATUSES.includes(status)) return null;

  entry.status = status;
  return entry;
}
function toPublic(entry) {
  return { id: entry.id, name: entry.name, role: entry.role, status: entry.status };
}
function getList() {
  return Array.from(onlineUsers.values()).map(toPublic);
}

module.exports = { addUser, removeSocket, setStatus, getList, toPublic };
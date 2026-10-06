const jwt = require('jsonwebtoken');
function socketAuth(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role
    };

    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
}

module.exports = socketAuth;
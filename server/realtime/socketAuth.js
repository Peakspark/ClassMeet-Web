const jwt = require('jsonwebtoken');
function parseCookies(header) {
  const result = {};
  header.split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index === -1) return;
    const key = part.slice(0, index).trim();
    result[key] = decodeURIComponent(part.slice(index + 1).trim());
  });
  return result;
}

async function socketAuth(socket, next) {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie || '');
    if (cookies.token) {
      const res = await fetch(process.env.AUTH_URL + '/api/auth/me', {
        headers: { Cookie: 'token=' + cookies.token }
      });

      if (!res.ok) {
        return next(new Error('Not logged in'));
      }
      const data = await res.json();
      socket.user = {
        id: data.user.id,
        name: data.user.name,
        role: data.user.role
      };
      return next();
    }
    if (process.env.NODE_ENV !== 'production' && socket.handshake.auth.token) {
      const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
      socket.user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role
      };
      return next();
    }
    return next(new Error('No token provided'));
  } catch (err) {
    console.error('Socket auth failed:', err.message);
    return next(new Error('Authentication failed'));
  }
}module.exports = socketAuth;
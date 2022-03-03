const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  console.log('Authenticating every request in a Custom Middleware function');
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwt.jwtPrivateKey'));
    req.user = decoded;
    next(); // Pass control to the next function, if not called, request hangs
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
}

module.exports = auth;
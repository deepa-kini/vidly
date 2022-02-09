function auth(req, res, next) {
  console.log('Authenticating every request in a Custom Middleware function');
  next(); // Pass control to the next function, if not called, request hangs
}

module.exports = auth;
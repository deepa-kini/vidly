const config = require('config');

module.exports = function () {
  if (!config.get('jwt.jwtPrivateKey')) {
    throw new Error('Environment variables are not defined');
    process.exit(1);
  }
  const dbPassword = config.get('database.password');
  if (!dbPassword) {
    throw new Error('Environment variables are not defined');
    process.exit(1);
  }
}
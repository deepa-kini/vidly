const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function () {
  const dbPassword = config.get('database.password');
  if (!dbPassword) {
    console.error('Environment variables are not defined');
    process.exit(1);
  }
  const dbConnect = `mongodb+srv://root:${dbPassword}@playground.mryia.mongodb.net/vidly?retryWrites=true&w=majority`;
  mongoose.connect(dbConnect)
    .then(() => winston.info('Connected to MongoDB...'));
}

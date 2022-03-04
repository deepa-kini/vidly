
require('express-async-errors');
const winston = require('winston');
const morgan = require('morgan');
const logger = require('../middleware/logger');

module.exports = function (app) {

  // winston.add(new winston.transports.File({ filename: 'logfile.log', handleExceptions: true }));
  winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));

  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }
  app.use(logger);
}
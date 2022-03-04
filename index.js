require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
require('winston-mongodb');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const logger = require('./middleware/logger');

const app = express();
require('./startup/routes')(app);

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const port = process.env.PORT || 3000;

const dbPassword = config.get('database.password');
if (!config.get('jwt.jwtPrivateKey') || !dbPassword) {
  console.error('Environment variables are not defined');
  process.exit(1);
}

const dbConnect = `mongodb+srv://root:${dbPassword}@playground.mryia.mongodb.net/vidly?retryWrites=true&w=majority`;
mongoose.connect(dbConnect)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('error', err.message));

winston.add(new winston.transports.File({ filename: 'logfile.log', handleExceptions: true }));
winston.add(new winston.transports.MongoDB({ db: dbConnect, level: 'error' }))

app.set('view engine', 'pug');

// Built-in Middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Third-party Middleware functions
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

// Custom Middleware functions
app.use(logger);

// Establish the routes

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

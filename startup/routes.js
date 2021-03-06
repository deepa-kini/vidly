const express = require('express');
const helmet = require('helmet');
const error = require('../middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const homepage = require('../routes/homepage');

module.exports = function (app) {
  app.set('view engine', 'pug');

  // Built-in Middleware functions
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  // Third-party Middleware functions
  app.use(helmet());


  // Routes
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', homepage);

  // Error middleware
  app.use(error);

}
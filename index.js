require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const logger = require('./middleware/logger');
const error = require('./middleware/error');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const homepage = require('./routes/homepage');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const port = process.env.PORT || 3000;
const app = express();

const dbPassword = config.get('database.password');
if (!config.get('jwt.jwtPrivateKey') || !dbPassword) {
  console.error('Environment variables are not defined');
  process.exit(1);
}

const dbConnect = `mongodb+srv://root:${dbPassword}@playground.mryia.mongodb.net/vidly?retryWrites=true&w=majority`;
mongoose.connect(dbConnect)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('error', err.message));


app.set('view engine', 'pug');

// Built-in Middleware functions
app.use(express.json());
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
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', homepage);

// Error middleware
app.use(error);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

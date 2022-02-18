const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const genres = require('./routes/genres');
const homepage = require('./routes/homepage');

const port = process.env.PORT || 3000;
const app = express();

const password = config.get('database.password');
const dbConnect = `mongodb+srv://root:${password}@playground.mryia.mongodb.net/vidly?retryWrites=true&w=majority`;
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
app.use(auth);

// Establish the routes
app.use('/api/genres', genres);
app.use('/', homepage);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

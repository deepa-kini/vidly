const debug = require('debug')('app:startup');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const auth = require('./auth');
const Joi = require('joi');
const port = process.env.PORT || 3000;
const app = express();

// Built-in Middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Third-party Middleware functions
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan Enabled!');
}

// Custom Middleware functions
app.use(logger);
app.use(auth);

const genres = [
  { id: 1, name: 'comedy' },
  { id: 2, name: 'drama' },
  { id: 3, name: 'musical' }
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");
  res.send(genre);
});

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(genre);
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

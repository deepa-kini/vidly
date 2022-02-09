const Joi = require('joi');
const express = require('express');

const Router = express.Router();

const genres = [
  { id: 1, name: 'comedy' },
  { id: 2, name: 'drama' },
  { id: 3, name: 'musical' }
];

Router.get('/', (req, res) => {
  res.send(genres);
});

Router.get('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");
  res.send(genre);
});

Router.post('/', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  res.send(genre);
});

Router.put('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

Router.delete('/:id', (req, res) => {
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

module.exports = Router;
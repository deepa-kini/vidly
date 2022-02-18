const express = require('express');
const { validate, Genre } = require('../models/genre');

const Router = express.Router();


Router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

Router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("The genre does not exist!");
  res.send(genre);
});

Router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  })

  genre = await genre.save();
  res.send(genre);
});

Router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  }, {
    new: true
  });
  if (!genre) return res.status(404).send("The genre does not exist!");

  res.send(genre);
});

Router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("The genre does not exist!");

  res.send(genre);
});

module.exports = Router;
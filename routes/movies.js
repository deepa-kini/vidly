const express = require('express');
const { validate, Movie } = require('../models/movie');
const { Genre } = require('../models/genre');

const Router = express.Router();


Router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

Router.get('/:id', async (req, res) => {
  const movie = await Genre.findById(req.params.id);
  if (!movie) return res.status(404).send("The movie does not exist!");
  res.send(movie);
});

Router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("The genre does not exist!");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })

  await movie.save();
  res.send(movie);
});

Router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("The genre does not exist!");

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

Router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("The movie does not exist!");

  res.send(movie);
});

module.exports = Router;
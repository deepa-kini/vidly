const express = require('express');
const { validate, Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const Router = express.Router();


Router.get('/', async (req, res) => {
  const rentals = await Movie.find().sort('-dateOut');
  res.send(rentals);
});

Router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("The customer does not exist!");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("The movie does not exist!");

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  })

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);

});

module.exports = Router;
const express = require('express');
const { validate, Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const config = require('config');
const Fawn = require('fawn');

const password = config.get('database.password');
const dbConnect = `mongodb://root:${password}@playground.mryia.mongodb.net/vidly?retryWrites=true&w=majority`;

Fawn.init(dbConnect);
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
      title: movie.name,
      dailyRentalRate: movie.dailyRentalRate
    },
  })

  try {
    // working with collection directly
    // Case-sensitive
    await new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('something failed');
  }
});

module.exports = Router;
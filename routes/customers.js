const express = require('express');
const { validate, Customer } = require('../models/customer')
const auth = require('../middleware/auth');
const Router = express.Router();

Router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

Router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("The customer does not exist!");
  res.send(customer);
});

Router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  await customer.save();
  res.send(customer);
});

Router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  }, {
    new: true
  });
  if (!customer) return res.status(404).send("The customer does not exist!");

  res.send(customer);
});

Router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("The genre does not exist!");

  res.send(customer);
});

module.exports = Router;
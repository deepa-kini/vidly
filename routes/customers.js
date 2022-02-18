const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');

const Router = express.Router();


const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    maxlength: 10,
  },
  isGold: {
    type: Boolean,
    default: false
  }
});

const Customer = mongoose.model('Customer', customerSchema)


Router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

Router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("The customer does not exist!");
  res.send(customer);
});

Router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  customer = await customer.save();
  res.send(customer);
});

Router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
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

Router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("The genre does not exist!");

  res.send(customer);
});

function validateCustomer(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    isGold: Joi.boolean().default(false)
  });
  return schema.validate(genre);
}

module.exports = Router;
const Joi = require('joi');
const mongoose = require('mongoose');

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

function validateCustomer(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    isGold: Joi.boolean().default(false)
  });
  return schema.validate(genre);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
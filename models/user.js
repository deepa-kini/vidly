const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    isAdmin: this.isAdmin
  };

  const jwtPrivateKey = config.get('jwt.jwtPrivateKey');
  return jwt.sign(payload, jwtPrivateKey);
}

const User = mongoose.model('User', userSchema);



function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean()
  });
  return schema.validate(user);
}


module.exports.User = User;
module.exports.validate = validateUser;

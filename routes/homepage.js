const express = require('express');

const Router = express.Router();

Router.get('/', (req, res) => {
  // render html
  // index.pug
  res.render('index', {
    title: 'My Express App',
    message: 'Hello'
  });
});

module.exports = Router;
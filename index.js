const express = require('express');
const port = process.env.PORT || 3000;
const Joi = require('joi');
const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: 'comedy' },
  { id: 2, name: 'drama' },
  { id: 3, name: 'musical' }
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send("The genre does not exist!");
  res.send(genre);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

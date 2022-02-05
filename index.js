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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

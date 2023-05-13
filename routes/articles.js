const express = require('express');
const router = express.Router();

// GET /articles?take=10&skip=0
router.get('/', (req, res) => {
  const take = req.query.take || 10;
  const skip = req.query.skip || 0;
  // retrieve articles from the database using take and skip
  res.send('GET /articles');
});

// GET /articles/123
router.get('/:id', (req, res) => {
  const id = req.params.id;
  // retrieve the article with the given id from the database
  res.send(`GET /articles/${id}`);
});

// POST /articles
router.post('/', (req, res) => {
  const article = req.body;
  // insert the new article into the database
  res.send('POST /articles');
});

// PATCH /articles
router.patch('/', (req, res) => {
  const article = req.body;
  // update the article in the database
  res.send(`PATCH /articles`);
});

// DELETE /articles/123
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  // delete the article with the given id from the database
  res.send(`DELETE /articles/${id}`);
});

module.exports = router;

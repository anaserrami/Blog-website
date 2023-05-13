const express = require('express');
const router = express.Router();

// GET /categories?take=10&skip=0
router.get('/', (req, res) => {
  const take = req.query.take || 10;
  const skip = req.query.skip || 0;
  // retrieve categories from the database using take and skip
  res.send('GET /categories');
});

// GET /categories/123
router.get('/:id', (req, res) => {
  const id = req.params.id;
  // retrieve the categorie with the given id from the database
  res.send(`GET /categories/${id}`);
});

// POST /categories
router.post('/', (req, res) => {
  const categorie = req.body;
  // insert the new categorie into the database
  res.send('POST /categories');
});

// PATCH /categories
router.patch('/', (req, res) => {
  const categorie = req.body;
  // update the categorie in the database
  res.send(`PATCH /categories`);
});

// DELETE /categories/123
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  // delete the categorie with the given id from the database
  res.send(`DELETE /categories/${id}`);
});

module.exports = router;

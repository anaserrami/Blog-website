const express = require('express');
const router = express.Router();

// GET /commentaires?take=10&skip=0
router.get('/', (req, res) => {
  const take = req.query.take || 10;
  const skip = req.query.skip || 0;
  // retrieve commentaires from the database using take and skip
  res.send('GET /commentaires');
});

// GET /commentaires/123
router.get('/:id', (req, res) => {
  const id = req.params.id;
  // retrieve the commentaire with the given id from the database
  res.send(`GET /commentaires/${id}`);
});

// POST /commentaires
router.post('/', (req, res) => {
  const commentaire = req.body;
  // insert the new commentaire into the database
  res.send('POST /commentaires');
});

// PATCH /commentaires
router.patch('/', (req, res) => {
  const id = req.params.id;
  const commentaire = req.body;
  // update the commentaire in the database
  res.send(`PATCH /commentaires`);
});

// DELETE /commentaires/123
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  // delete the commentaire with the given id from the database
  res.send(`DELETE /commentaires/${id}`);
});

module.exports = router;

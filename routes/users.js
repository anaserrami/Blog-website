const express = require('express');
const router = express.Router();

// GET /users?take=10&skip=0
router.get('/', (req, res) => {
  const take = req.query.take || 10;
  const skip = req.query.skip || 0;
  // retrieve users from the database using take and skip
  res.send('GET /users');
});

// GET /users/123
router.get('/:id', (req, res) => {
  const id = req.params.id;
  // retrieve the user with the given id from the database
  res.send(`GET /users/${id}`);
});

// POST /users
router.post('/', (req, res) => {
  const user = req.body;
  // insert the new user into the database
  res.send('POST /users');
});

// PATCH /users
router.patch('/', (req, res) => {
  const user = req.body;
  // update the user in the database
  res.send(`PATCH /users`);
});

// DELETE /users/123
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  // delete the user with the given id from the database
  res.send(`DELETE /users/${id}`);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /users?take=10&skip=0
router.get('/', async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const users = await prisma.user.findMany({
      take,
      skip,
    });
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users from the database');
  }
});

// GET /users/123
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user from the database');
  }
});

// POST /users
router.post('/', async (req, res) => {
  const user = req.body;
  try {
    const newUser = await prisma.user.create({
      data: user,
    });
    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new user');
  }
});

// PATCH /users/123
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: user,
    });
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
});

// DELETE /users/123
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.send(`User with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
});

module.exports = router;

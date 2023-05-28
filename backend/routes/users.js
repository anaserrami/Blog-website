const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/middleware");

// GET /users?take=10&skip=0
router.get('/', async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const users = await prisma.user.findMany({
      take,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        articles: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            categories:{
              select: {
                id: true,
                name: true,
              }
            },
            comments:{
              select: {
                id: true,
                email: true,
                content: true,
              }
            },
          }
        }
      }
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        articles: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            author:{
              select:{
                name: true,
              }
            },
            categories:{
              select: {
                id: true,
                name: true,
              }
            },
            comments:{
              select: {
                id: true,
                email: true,
                content: true,
              }
            },
          },
          orderBy:{
            createdAt:"desc",
          }
        }
      },
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
router.post('/', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "AUTHOR"
      },
    });
    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new user');
  }
});

// PATCH /users/123
router.patch('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, password } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        role: "AUTHOR"
      },
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
    // Find articles associated with the user
    const articles = await prisma.article.findMany({
      where: { authorId: id },
      select: {
        id: true,
      },
    });

    // Delete associated articles and comments
    const articleIds = articles.map((article) => article.id);
    await prisma.comment.deleteMany({
      where: { articleId: { in: articleIds } },
    });
    await prisma.article.deleteMany({
      where: { authorId: id },
    });

    // Delete the user
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

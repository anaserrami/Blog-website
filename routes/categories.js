const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/middleware");

// GET /categories?take=10&skip=0
router.get('/', async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const categories = await prisma.category.findMany({
      take,
      skip,
    });
    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving categories from the database');
  }
});

// GET /categories/123
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const categorie = await prisma.category.findUnique({
      where: { id },
    });
    if (categorie) {
      res.send(categorie);
    } else {
      res.status(404).send('Categorie not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving categorie from the database');
  }
});

// POST /categories
router.post('/', verifyToken, async (req, res) => {
  const {name} = req.body;
  try {
    const newCategorie = await prisma.category.create({
      data:{
        name,
      },
    });
    res.send(newCategorie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new categorie');
  }
});

// PATCH /categories/123
router.patch('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const {name} = req.body;
  try {
    const updatedCategorie = await prisma.category.update({
      where: { id },
      data:{
        name,
      },
    });
    res.send(updatedCategorie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating categorie');
  }
});

// DELETE /categories/123
router.delete('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Find articles associated with the category
    const articles = await prisma.article.findMany({
      where: { categories: { some: { id } } },
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
      where: { categories: { some: { id } } },
    });

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });
    res.send(`Categorie with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting categorie');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
router.post('/', async (req, res) => {
  const categorie = req.body;
  try {
    const newCategorie = await prisma.category.create({
      data: categorie,
    });
    res.send(newCategorie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new categorie');
  }
});

// PATCH /categories/123
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const categorie = req.body;
  try {
    const updatedCategorie = await prisma.category.update({
      where: { id },
      data: categorie,
    });
    res.send(updatedCategorie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating categorie');
  }
});

// DELETE /categories/123
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
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

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/middleware");

// GET /commentaires?take=10&skip=0
router.get("/", async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const commentaires = await prisma.comment.findMany({
      take,
      skip,
      include: {
        article: {
          select: {
            title: true,
            content: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            authorId: true,
          },
        },
      },
    });
    res.send(commentaires);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving commentaires from the database");
  }
});

// GET /commentaires/123
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const commentaire = await prisma.comment.findUnique({
      where: { id },
      include: {
        article: {
          select: {
            title: true,
            content: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            authorId: true,
          },
        },
      },
    });
    if (commentaire) {
      res.send(commentaire);
    } else {
      res.status(404).send("Commentaire not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving commentaire from the database");
  }
});

// POST /commentaires
router.post("/", verifyToken, async (req, res) => {
  const { email, content, articleId } = req.body;

  try {
    const newCommentaire = await prisma.comment.create({
      data: {
        email,
        content,
        articleId: Number(articleId),
      },
      include: {
        article: true,
      },
    });

    res.send(newCommentaire);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating new commentaire");
  }
});

// PATCH /commentaires/:id
router.patch("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const { content } = req.body;
  
  try {
    const existingCommentaire = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingCommentaire) {
      return res.status(404).send("Commentaire not found");
    }

    const updatedCommentaire = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        article: true,
      },
    });

    res.send(updatedCommentaire);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating commentaire");
  }
});

// DELETE /commentaires/123
router.delete("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.comment.delete({
      where: { id },
    });
    res.send(`Commentaire with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting commentaire");
  }
});

module.exports = router;

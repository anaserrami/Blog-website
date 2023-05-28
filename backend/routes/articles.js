const express = require("express");
var path = require('path');

const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/middleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "images")); // Replace 'uploads' with the desired folder path
  },
  filename: function (req, file, cb) {
    const uniqueFilename =
      Math.floor(Date.now() / 1000) + "-" + file.originalname;
    cb(null, uniqueFilename);
    req.filePath = "http://localhost:3001/images/" + uniqueFilename;
  },
});
const upload = multer({ storage });



// GET /articles?take=10&skip=0
router.get("/", async (req, res) => {
  const take = Number(req.query.take) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const articles = await prisma.article.findMany({
      take,
      skip,
      select:{
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
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
            article: {
              select:{
                author:{
                  select:{
                    name: true,
                  }
                }
              }
            }
          }
        },
      }
    });
    res.send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving articles from the database");
  }
});

// GET /articles/123
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select:{
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
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
            article: {
              select:{
                author:{
                  select:{
                    name: true,
                  }
                }
              }
            }
          }
        },
      }
    });
    if (article) {
      res.send(article);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving article from the database");
  }
});

// POST /articles
router.post("/",verifyToken,upload.single("image"), async (req, res) => {
  const { title, content, categories } = req.body;
  console.log(categories)
  const { user } = req; // Access the authenticated user

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        image:req.filePath,
        author: { connect: { id: user.user_id } },
        categories: { connect: categories.map((id)=>({id:parseInt(id)})) },
        published: true,
      },
    });
    res.send(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating new article");
  }
});

// PATCH /articles/123
router.patch("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const { title, content, image, categories } = req.body;
  const { user } = req; // Access the authenticated user

  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image,
        author: { connect: { id: user.user_id } },
        categories: { set: categories },
        published: true,
      },
    });
    res.send(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating article");
  }
});

// DELETE /articles/123
router.delete("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Delete associated comments first
    await prisma.comment.deleteMany({
      where: { articleId: id },
    });

    // Delete the article
    await prisma.article.delete({
      where: { id },
    });
    res.send(`Article with id ${id} deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting article");
  }
});

module.exports = router;

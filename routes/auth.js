const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(name && email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role:"AUTHOR"
      },
    });

    // Create token
    const token = jwt.sign(
      { user_id: newUser.id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2d" }
    );

    // Return new user and token
    return res.status(201).json({status : true, user: newUser, token : token});
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    
    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2d" }
      );

      // Return new user and token
      return res.status(200).json({status : true, user : user, token : token });
    }

    // User not found or invalid credentials
    return res.status(400).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

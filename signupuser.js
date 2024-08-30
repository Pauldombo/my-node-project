require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./dbconnection"); // Use the pool connection

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please fill in all fields.");
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();

    try {
      const [results] = await connection.query(
        `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
        [username, email, hash]
      );

      const user_id = results.insertId;

      // Insert laptop details for the user
      await insertLaptopDetailsForUser(user_id);

      res.status(200).send("Sign up successful!");
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error registering user.");
  }
});

module.exports = router;

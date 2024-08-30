const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./dbconnection"); // Use the connection pool

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool

    try {
      const [result] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (result.length === 0) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      res.status(200).json({ message: "Login successful" });
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

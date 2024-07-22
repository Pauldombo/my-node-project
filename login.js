const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("./dbconnection");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result[0];
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      res.status(200).json({ message: "Login successful" });
    });
  });
});

module.exports = router;

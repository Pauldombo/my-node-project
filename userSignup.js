const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("./dbconnection");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;

    connection.query(
      query,
      [`${firstName} ${lastName}`, email, passwordHash],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res
              .status(400)
              .send({ message: "User with this email already exists." });
          } else {
            res.status(500).send({ message: "Error signing up." });
          }
          return;
        }
        res.status(200).send({ message: "Sign up successful" });
      }
    );
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("./dbconnection");

const router = express.Router();

router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const query =
    "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?";
  connection.query(query, [token, Date.now()], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res
        .status(400)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    const user = result[0];
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      const updateQuery =
        "UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE user_id = ?";
      connection.query(updateQuery, [hash, user.user_id], (err) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ message: "Password has been reset" });
      });
    });
  });
});

module.exports = router;

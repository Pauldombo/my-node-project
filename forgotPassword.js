const express = require("express");
const crypto = require("crypto");
const connection = require("./dbconnection");
const sendEmail = require("./sendemailside"); // Assume you have a module to send emails

const router = express.Router();

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  const expiration = Date.now() + 3600000; // 1 hour

  const query =
    "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?";
  connection.query(query, [token, expiration, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No user found with that email" });
    }

    const resetLink = `http://192.168.137.1:3000/reset-password/${token}`;
    const emailContent = `Please click on the following link to reset your password: ${resetLink}`;

    sendEmail(email, "Password Reset", emailContent)
      .then(() => {
        res.status(200).json({ message: "Password reset email sent" });
      })
      .catch((err) => {
        res.status(500).json({ error: "Error sending email" });
      });
  });
});

module.exports = router;

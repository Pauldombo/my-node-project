require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const bcrypt = require("bcryptjs");
const connection = require("./dbconnection"); // Import the connection
const insertLaptopDetailsForUser = require("./devicedatamoble"); // Import device data function

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "b[G%DtWJK<a:pBj+S9l{V@='2{lQvB"; // Use environment variable for security

// Signup route
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please fill in all fields.");
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send("Error encrypting password.");
    }

    // Save the user to the database
    const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    connection.query(query, [username, email, hash], (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("Error registering user.");
      }

      const user_id = results.insertId; // Get the inserted user ID

      // Insert laptop details for the user
      insertLaptopDetailsForUser(user_id);

      res.status(200).send("Sign up successful!");
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

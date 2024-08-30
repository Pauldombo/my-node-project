const express = require("express");
const router = express.Router();
const pool = require("./dbconnection"); // Use the pool connection

// Endpoint to retrieve laptop names
router.get("/laptops", async (req, res) => {
  const query = "SELECT device_name FROM devices"; // Adjust the query according to your database schema

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error retrieving laptop names:", err);
    res.status(500).send("Error retrieving laptop names");
  }
});

module.exports = router;

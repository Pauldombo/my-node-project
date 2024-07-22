const express = require("express");
const router = express.Router();
const connection = require("./dbconnection");

// Endpoint to retrieve laptop names
router.get("/laptops", (req, res) => {
  const query = "SELECT device_name FROM devices"; // Adjust the query according to your database schema
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving laptop names:", err);
      res.status(500).send("Error retrieving laptop names");
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = router;

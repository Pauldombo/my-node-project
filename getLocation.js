const express = require("express");
const router = express.Router();
const db = require("./db"); // Adjust the path to your database connection module

router.get("/get_location", (req, res) => {
  const query =
    "SELECT latitude, longitude FROM locations ORDER BY timestamp DESC LIMIT 1";

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Error fetching location");
    } else {
      if (result.length > 0) {
        const { latitude, longitude } = result[0];
        res.send(`${latitude},${longitude}`);
      } else {
        res.status(404).send("No location found");
      }
    }
  });
});

module.exports = router;

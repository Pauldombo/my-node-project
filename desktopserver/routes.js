const express = require("express");
const db = require("./db");

const router = express.Router();

router.get("/userId/:deviceName", (req, res) => {
  const { deviceName } = req.params;
  const query = "SELECT id FROM devices WHERE name = ?";
  db.query(query, [deviceName], (err, result) => {
    if (err) {
      res.status(500).send("Error fetching user ID");
    } else if (result.length > 0) {
      res.send({ userId: result[0].id });
    } else {
      res.status(404).send("Device not found");
    }
  });
});

router.get("/get_location", (req, res) => {
  const query =
    "SELECT latitude, longitude FROM locations ORDER BY timestamp DESC LIMIT 1";
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Error fetching location");
    } else if (result.length > 0) {
      const { latitude, longitude } = result[0];
      res.send(`${latitude},${longitude}`);
    } else {
      res.status(404).send("No location found");
    }
  });
});

router.get("/shutdown", (req, res) => {
  res.send("Server shutting down...");
  process.exit(0);
});

module.exports = router;

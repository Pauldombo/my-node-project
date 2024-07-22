const express = require("express");
const connection = require("./dbconnection");

const router = express.Router();

router.post("/device/ip", (req, res) => {
  const { device_id, ip_address } = req.body;

  const checkIpQuery = `SELECT id FROM device_ips WHERE device_id = ? AND ip_address = ?`;

  connection.query(checkIpQuery, [device_id, ip_address], (err, results) => {
    if (results.length > 0) {
      const ipId = results[0].id;
      const updateIpQuery = `
        UPDATE device_ips
        SET ip_address = ?, updated_at = NOW()
        WHERE id = ?
      `;
      connection.query(updateIpQuery, [ip_address, ipId], (err, results) => {
        res.status(200).send("IP address updated successfully");
      });
    } else {
      const insertIpQuery = `
        INSERT INTO device_ips (device_id, ip_address, updated_at)
        VALUES (?, ?, NOW())
      `;
      connection.query(
        insertIpQuery,
        [device_id, ip_address],
        (err, results) => {
          res.status(200).send("IP address inserted successfully");
        }
      );
    }
  });
});

module.exports = router;

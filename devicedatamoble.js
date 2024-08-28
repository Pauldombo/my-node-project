const mysql = require("mysql2");
const os = require("os");
const ip = require("ip");
const connection = require("./dbconnection");

const insertLaptopDetailsForUser = (user_id) => {
  const device_name = os.hostname();
  const ip_address = ip.address();
  const operating_system = `${os.type()} ${os.release()}`;
  const device_type = "PC";

  // Check if the device already exists for the user
  const checkEntry = `
    SELECT * FROM devices WHERE user_id = ? AND device_name = ? AND ip_address = ?;
  `;

  connection.query(
    checkEntry,
    [user_id, device_name, ip_address],
    (err, results) => {
      if (err) {
        console.error("Error checking existing device:", err);
        return;
      }

      if (results.length === 0) {
        // Insert new device details if not already present
        const insertLaptopDetails = `
        INSERT INTO devices (user_id, device_name, device_type, operating_system, ip_address)
        VALUES (?, ?, ?, ?, ?);
      `;

        connection.query(
          insertLaptopDetails,
          [user_id, device_name, device_type, operating_system, ip_address],
          (err) => {
            if (err) {
              console.error("Error inserting device details:", err);
            } else {
              console.log("Device details inserted successfully.");
            }
          }
        );
      } else {
        console.log("Device details already exist.");
      }
    }
  );
};

module.exports = insertLaptopDetailsForUser;

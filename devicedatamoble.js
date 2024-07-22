const mysql = require("mysql2");
const os = require("os");
const ip = require("ip");
const connection = require("./dbconnection");

const insertLaptopDetailsForUser = (user_id) => {
  const device_name = os.hostname();
  const ip_address = ip.address();
  const operating_system = `${os.type()} ${os.release()}`;
  const device_type = "PC";

  const insertLaptopDetails = `
    INSERT INTO devices (user_id, device_name, device_type, operating_system, ip_address)
    VALUES (?, ?, ?, ?, ?);
  `;

  connection.query(
    insertLaptopDetails,
    [user_id, device_name, device_type, operating_system, ip_address],
    (err, results) => {
      if (err) {
        return;
      }

      const checkEntry = `
        SELECT * FROM devices WHERE user_id = ? AND device_name = ? AND ip_address = ?;
      `;
      connection.query(
        checkEntry,
        [user_id, device_name, ip_address],
        (err, results) => {
          if (results.length === 0) {
            return;
          }
        }
      );
    }
  );
};

const getUserAndInsertLaptopDetails = () => {
  connection.query("SELECT user_id FROM users LIMIT 1", (err, results) => {
    if (results.length === 0) {
      return;
    }

    const user_id = results[0].user_id;
    insertLaptopDetailsForUser(user_id);
  });
};

module.exports = getUserAndInsertLaptopDetails;

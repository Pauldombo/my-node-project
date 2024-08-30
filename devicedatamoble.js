const mysql = require("mysql2");
const os = require("os");
const ip = require("ip");
const pool = require("./dbconnection"); // Assuming this uses a connection pool

const getUserId = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(
      `SELECT user_id FROM users WHERE email = ?`,
      [email]
    );
    if (results.length > 0) {
      return results[0].user_id;
    } else {
      console.error("User not found");
      return null;
    }
  } catch (err) {
    console.error("Error fetching user ID:", err);
    return null;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

const insertLaptopDetailsForUser = async (user_id) => {
  if (!user_id) {
    console.error("Invalid user ID");
    return;
  }

  const device_name = os.hostname();
  const ip_address = ip.address();
  const operating_system = `${os.type()} ${os.release()}`;
  const device_type = "PC";

  const connection = await pool.getConnection();

  try {
    // Check if the device already exists for the user
    const [results] = await connection.query(
      `SELECT * FROM devices WHERE user_id = ? AND device_name = ? AND ip_address = ?`,
      [user_id, device_name, ip_address]
    );

    if (results.length === 0) {
      // Insert new device details if not already present
      await connection.query(
        `INSERT INTO devices (user_id, device_name, device_type, operating_system, ip_address)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, device_name, device_type, operating_system, ip_address]
      );
      console.log("Device details inserted successfully.");
    } else {
      console.log("Device details already exist.");
    }
  } catch (err) {
    console.error("Error processing device details:", err);
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

// Get the email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error(
    "Please provide an email as an argument, e.g., node devicedatamoble.js user@example.com"
  );
  process.exit(1);
}

getUserId(email).then((userId) => {
  if (userId) {
    insertLaptopDetailsForUser(userId);
  }
});

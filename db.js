const mysql = require("mysql2");

// Create a connection to the database with multiple statements enabled
const connection = mysql.createConnection({
  host: "bsd05j9tx0ens4wdc3eg-mysql.services.clever-cloud.com",
  user: "uxh5wazsgwbxoahx", //  MySQL user
  password: "83hoPcQnlrCThVknh6gs", //  MySQL password
  database: "bsd05j9tx0ens4wdc3eg", //  MySQL database name
  multipleStatements: true,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");

  // Create tables if they don't exist
  const createTables = `
  CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      user_password_hash VARCHAR(255) NOT NULL,  -- Renamed
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS devices (
      device_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      device_name VARCHAR(100) NOT NULL,
      device_type VARCHAR(100) NOT NULL,
      operating_system VARCHAR(100) NOT NULL,
      ip_address VARCHAR(45) NOT NULL,
      last_active TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
      session_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      device_id INT NOT NULL,
      session_start TIMESTAMP NOT NULL,
      session_end TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (device_id) REFERENCES devices(device_id)
  );
  
  CREATE TABLE IF NOT EXISTS server_passwords (
      password_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      server_password_hash VARCHAR(255) NOT NULL,  -- Renamed
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS locations (
      location_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
  );
`;

  connection.query(createTables, (err, results) => {
    if (err) {
      console.error("Error creating tables:", err);
    } else {
      console.log("Tables created or already exist");
    }
    connection.end();
  });
});

module.exports = connection;

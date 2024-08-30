require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20, // Adjust the limit based on your needs
  queueLimit: 0,
});

// No need to call `connection.connect()` since `pool` manages the connections automatically

module.exports = pool.promise(); // Exporting a promise-based pool

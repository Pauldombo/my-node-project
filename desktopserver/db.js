const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "bsd05j9tx0ens4wdc3eg-mysql.services.clever-cloud.com",
  user: "uxh5wazsgwbxoahx",
  password: "83hoPcQnlrCThVknh6gs",
  database: "bsd05j9tx0ens4wdc3eg",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database on Clever Cloud");
});

module.exports = db;

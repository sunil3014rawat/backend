const mysql = require("mysql2/promise"); // requiring mysql2/promise for async database connection
require("dotenv").config(); // loading .env file to use environment variables

// creating a database connection pool with environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST, // database host name
  user: process.env.DB_USER, // database user name
  database: process.env.DB_NAME, // name of the database to connect to
});

module.exports = db; // exporting the db connection pool so it can be used in other parts of the project

// File: db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  // password: process.env.DB_PASS, // Uncomment if you're using a password
  database: process.env.DB_NAME
});

module.exports = db;

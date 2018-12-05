const mysql = require('mysql');

const inquirer = require('inquirer');

const dotenv = require('dotenv');

const keys = dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: keys.parsed.SQLPASS,
  database: "playlist_db"
});

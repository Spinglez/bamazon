const mysql = require('mysql');

const inquirer = require('inquirer');

const dotenv = require('dotenv');

const cTable = require('console.table');

const keys = dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: keys.parsed.SQLPASS,
  database: "bamazon"
});

connection.query("SELECT * FROM products", function(err, res) {
  if (err) throw err;
  console.table(res);
  connection.end();
});

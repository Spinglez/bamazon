const mysql = require('mysql');

const inquirer = require('inquirer');

const dotenv = require('dotenv');

const cTable = require('console.table');

const keys = dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: keys.parsed.SQLPASS,
  database: "bamazon"
});

function dbCon(){
  console.log("WELCOME TO BAMZAON \n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    store();
  });
}

function store(){
  inquirer.prompt([
    {
    type: "input",
    default: "number",
    message: "Enter the product ID you'd like to purchase",
    name: "item",
    validate: validate
  },
  {
    type: "input",
    default: "number",
    message: "How many would you like?",
    name: "quantity",
    validate: validate
  }
  ])
  .then(function(answer){
      console.log(answer.item, answer.quantity);
      connection.end();
  })
}

function validate(name)
{
   let reg = /^\d+$/;
   return reg.test(name) || "Input should be a number!";
}

dbCon();

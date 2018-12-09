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
  console.log("Bamazon Manager interface make a selection below: \n");
  inv();
};

function inv(){
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ['View Current Inventory','View low Inventory', 'Restock Item in Inventory','Add New Product'],
      name: 'continue'
    }
  ]).then(function(answer){
    switch (answer.continue) {
      case 'View Current Inventory':
        currentInv();
        break;
      case 'View low Inventory':
        invLow();
        break;
      case 'View low Inventory':
        restock();
        break;
      case 'View low Inventory':
        newItem();
        break;
      default:
        dbCon();
    }
  });
}

function currentInv(){
  console.log("Here's the current Inventory:");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
      inv();
  });
}

function invLow(){
  let curInv = 'SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5'
  connection.query(curInv, function(err, res){
    if (err) throw err;
    console.table(res);
    connection.end();
  })
}

dbCon();

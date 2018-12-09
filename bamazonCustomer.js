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
    let query = "SELECT * FROM products WHERE ?"
      console.log(answer.item, answer.quantity);
      connection.query(query, {item_id: answer.item}, function(err,res){
        if (err) throw err;
        else if (res[0].stock_quantity <= -1 || res[0].stock_quantity - answer.quantity <= -1) {
          console.log("\nthere's not sufficient quantity to purchase, please select an available amount or another item while we re-stock");
          store();
        }
        else {
          updateStock(res[0].stock_quantity, answer.quantity, answer.item);
          // connection.query(stock, [{stock_quantity: res[0].stock_quantity - answer.quantity}, {item_id: answer.item}],function(err,resp))
          console.log("you're purchasing:",answer.quantity,res[0].product_name +"(s)","your total is: $"+answer.quantity * res[0].price);
        }
      })
      // connection.end();
  })
}

function contShop(){
  inquirer.prompt([
    {
      type: "list",
      message: "Continue Shopping?",
      choices: ['Yes','No'],
      name: 'continue'
    }
  ]).then(function(answer){
    switch (answer.continue) {
      case 'Yes':
        dbCon();
        break;
      case 'No':
        console.log("Thanks for shopping with us!");
        connection.end();
        break;
      default:
        dbCon();
    }
  })
}

// for this function x = current stock, y = amount to purchase, and z = the item_id of what they selected
function updateStock(x, y, z){
  let stock = "UPDATE products SET ? WHERE ?"
  connection.query(stock, [{stock_quantity: x - y}, {item_id: z}],function(err,resp){
    if (err) throw err;
    console.log(x - y,"Inventory updated!");
    contShop();
  })
};

function validate(name) {
   let reg = /^\d+$/;
   return reg.test(name) || "Input should be a number!";
}

dbCon();

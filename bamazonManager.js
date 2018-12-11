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
      choices: ['View Current Inventory','View low Inventory', 'Add quantity to items in Inventory','Add New Product','Exit'],
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
      case 'Add quantity to items in Inventory':
        restock();
        break;
      case 'Add New Product':
        newItem();
        break;
      case 'Exit':
        exit();
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
    dbCon();
  })
}

function restock(){
  inquirer.prompt([
    {
    type: "input",
    default: "number",
    message: "Enter the product ID you'd like to restock",
    name: "item",
    validate: validate
  },
  {
    type: "input",
    default: "number",
    message: "How many would you like to add?",
    name: "quantity",
    validate: validate
  }
  ])
  .then(function(answer){
    let query = "SELECT * FROM products WHERE ?"
      console.log(answer.item, answer.quantity);
      connection.query(query, {item_id: answer.item}, function(err,res){
        if (err) throw err;
        stock(res[0].stock_quantity, answer.quantity, answer.item);
        // connection.query(stock, [{stock_quantity: res[0].stock_quantity - answer.quantity}, {item_id: answer.item}],function(err,resp))
        console.log("You've added:",answer.quantity,res[0].product_name);
      })
  });
}

// for this function x = current stock, y = amount to add, and z = the item_id of what they selected
function stock(x, y, z){
  let stock = "UPDATE products SET ? WHERE ?"
  connection.query(stock, [{stock_quantity: (parseFloat(x) + parseFloat(y))}, {item_id: z}],function(err,resp){
    if (err) throw err;
    console.log("Inventory updated!\n");
    dbCon();
  })
};

function newItem(){
  inquirer.prompt([
    {
      type: 'input',
      default: 'string',
      message: 'Name of the product you\'re adding',
      name: 'prodName'
    },
    {
      type: 'input',
      default: 'string',
      message: 'Name of the department item belongs in?',
      name: 'deptName'
    },
    {
      type: "input",
      default: "number",
      message: "What's the price of the product you're adding?",
      name: "price",
    },
    {
      type: "input",
      default: "number",
      message: "How many would you like to add?",
      name: "quantity",
      validate: validate
    }
  ]).then(function(answer){
    console.log(answer.prodName,answer.deptName,answer.price,answer.quantity);
    let add = 'INSERT INTO products SET ?'
    let item = {product_name: answer.prodName, department_name: answer.deptName, price: answer.price, stock_quantity: answer.quantity};
    connection.query(add, item ,function(err,resp){
      if (err) throw err;
      console.log('added',res.affectedRows,'item');
    })
    exit();
  });
}

function validate(name) {
   let reg = /^\d+$/;
   return reg.test(name) || "Input should be a number!";
}

function exit(){
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to continue?",
      choices: ['Yes','No'],
      name: 'quit'
    }
  ]).then(function(answer){
    if (answer.quit == 'No') {
      console.log('Goodbye!');
      connection.end();
    }else {
      dbCon();
    }
  })
}

dbCon();

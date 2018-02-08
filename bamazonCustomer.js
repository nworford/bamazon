var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors/safe');
// var Table = require('cli-table');

//var colors = require('colors/safe');
//var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
askForId();

function askForId(){
    inquirer.prompt([{
        name:"product_id",
        message:"What product would you like to buy?"
    }]).then((answer) => {
        connection.query("SELECT * FROM products WHERE product_name=?",[answer.product_id],(error, results, fields) => {
            if(error){
                return console.error(error.message);
            }
            console.log(results);
            if(!results.length){
                return console.warn("Item not recognized!");
            }
            askForQuantity(results[0]); //response is answer.product_id
        });
        // connection.end();
    });

}

function askForQuantity(product_row){
    inquirer.prompt([{
        name:"product_quantity",
        message:"How many of " + product_row.product_name + " would you like to buy?"
    }]).then((answer) => {
        if(product_row.stock_quantity < answer.product_quantity){
            return console.warn("Insufficient stock quantity!");
        }
        console.log("Processing your order...");
        //response is answer.product_quantity
        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[product_row.stock_quantity - answer.product_quantity, product_row.item_id], (err, results, fields) => {
            if(err){
                return console.error(err.message);
            }
            console.log("SQL updated");
        });
        connection.query("INSERT INTO sales(item_id, department_id, quantity, product_sales) VALUES ("+[product_row.item_id, product_row.department_id, answer.product_quantity, answer.product_quantity * product_row.price].join(",")+")", (err, results, fields) =>{
            if(err){
                return console.error(err.message);
            }
            console.log("Your total is: $" + answer.product_quantity * product_row.price);
        })
        connection.end();
    });
}


// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors/safe');
// var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
manageStock();

function manageStock(){
    inquirer.prompt([{
        name:"manager",
        type:"rawlist",
        message:"Select your desired action.",
        choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function(ans){
        switch(ans.manager){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    })  
};

function viewProducts(){
    
    connection.query("SELECT * FROM products",(error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        
        for(var i = 0; i < results.length; i++){
            console.log("Id: " + results[i].item_id + "---" +
                results[i].product_name + "---" +
                results[i].department_name + "---" +
                results[i].price + "---" +
                results[i].stock_quantity);
        }
        
    })
        connection.end();
};

function lowInventory(){
    
    connection.query("SELECT * FROM products",(error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        
        for(var i = 0; i < results.length; i++){
            if(results[i].stock_quantity >= 50)continue;
            console.log("Id: " + results[i].item_id + "---" +
                    results[i].product_name + "---" +
                    results[i].department_name + "---" +
                    results[i].price + "---" +
                    results[i].stock_quantity);
        }
           
    });
    connection.end();
}

function addInventory(){
    inquirer.prompt([{
        name:"product_id",
        message:"What product would you like to add quantity to?"
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
        message:"How many of " + product_row.product_name + " would you like to add inventory to?"
    }]).then((answer) => {
        
        console.log("Processing your order...");
        //response is answer.product_quantity
        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[Number(product_row.stock_quantity) + Number(answer.product_quantity), product_row.item_id], (err, results, fields) => {
            if(err){
                return console.error(err.message);
            }
            console.log("SQL updated");
        });
    
        connection.end();
    });
}


function addNewProduct(){
    connection.query("SELECT * FROM products" ,(error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        inquirer.prompt([{
            name:"productName",
            type:"input",
            message:"What is the prouct name?"
        }, {
            name:"departmentName",
            type:"input",
            message:"What is the department name?"
        }, {
            name:"departmentId",
            type:"input",
            message:"What is the department id?"
        }, {
            name:"price",
            type:"input",
            message:"What is the price?"
        }, {
            name:"stock",
            type:"input",
            message:"What is the stock quantity?"
        }]).then(function(results){
            connection.query("INSERT INTO products(product_name, department_name, department_id, price, stock_quantity) VALUES(?, ?, ?, ?, ?)", [
                results.productName,
                results.departmentName,
                results.departmentId,
                results.price,
                results.stock
            ], (error, results, fields) =>{
             if(error){
                    return console.error(error.message);
                }
                console.log("SQL updated.")
                
            });
            connection.end();
        });
    });
    
}

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.





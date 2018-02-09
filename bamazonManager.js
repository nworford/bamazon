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
            case "View Products for sale":
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
    connection.query("SELECT * FROM products", function(err){
        if(err){
            return console.error(error.message);
        
        for(var i = 0; i < res.length; i++){
            console.log("Id: " + res[i].id + "---" +
                res[i].product_name + "---" +
                res[i].department_name + "---" +
                res[i].price + "---" +
                res[i].stock_quantity);
        }
        }
    })
        connection.end();
};

function lowInventory(){
    var lowInventoryList = [];
    connection.query("SELECT * FROM products", function(err, res){
        if(err){
            return console.error(error.message);
        for(var i = 0; i < res.length; i++){
            lowInventoryList.push(res[i]);
        }
    }
        for(var i = 0; i < lowInventoryList.length; i++){
            console.log("Id: " + lowInventoryList[i].id + "---" +
                    lowInventoryList[i].prouct_name + "---") +
                    lowInventoryList[i].department_name + "---" +
                    lowInventoryList[i].price + "---" +
                    lowInventoryList[i].stock_quantity);}
        })
        connection.end();
}

function addInventory(){
    var newQuantity;
    var newInventory;
    connection.query("SELECT * FROM products", function(err, res){
        if(err){
            return console.error(error.message);
            inquirer.prompt([{
                name:"productIdNumb",
                type:"input",
                message:"What is the product id number?"
            },{
                name:"addToQuantity",
                type:"input",
                message:"What is the current stock quantity>"
            }]).then(function(ans){
                for(var i = 0; i < res.length; i++){
                    if(res[i].id == ans.productIdNumb){
                        newQuantity = res[i];
                    newInventory = parseInt(res[i].stock_quantity) + parseInt(ans.addToQuantity);
                        console.log(newQuantity);
                    }
                }
                connection.query("UPDATE products SET ? WHERE ?", [
                    {stock_quantity: newInventory},{ id:ans.productIdNumb}],
                if(err) throw err;
                console.log("Inventory quantity updated."))
            })
            connection.end();
        }
    }
};

function addNewProduct(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err){
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
            name:"price",
            type:"input",
            message:"What is the price?"
        }, {
            name:"stock",
            type:"input",
            message:"What is the stock quantity?"
        }]).then(function(ans){
            connection.query("INSERT INTO products SET ?", {
                product_name: ans.productName,
                department_name: ans.departmentName,
                price: ans.price,
                stock_quantity: ans.stock
            }, function(err);
            if(err){
                return console.error(error.message);
            }
            connection.end();
        })
    })
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





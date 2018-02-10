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

supervisor();
function supervisor(){
    inquirer.prompt([{
        name:"supervisor",
        type:"rawlist",
        message:"Select your desired action.",
        choices:["View Products by Department", "Create New Department"]
    }]).then(function(ans){
        switch(ans.supervisor){
            case "View Products by Department":
                viewByDept();
                break;
            case "Create New Department":
                createNewDept();
                break;
        }
    })  
};

function viewByDept(){
    connection.query("SELECT * FROM sales" ,(error, sales, fields) => {
        if(error){
            return console.error(error.message);
        }
        console.log(sales);
        connection.query("SELECT * FROM departments", (error, departments, fields) => {
            console.log(departments);
        })
        connection.end();
    });
    
}

function createNewDept(){
    connection.query("SELECT * FROM departments" ,(error, results, fields) => {
        if(error){
            return console.error(error.message);
        }
        inquirer.prompt([{
            name:"deptName",
            type:"input",
            message:"What is the department name?"
        }, {

            name:"overHeadCosts",
            type:"input",
            message:"What is the over head costs?"
        }
           
        ]).then(function(results){
            connection.query("INSERT INTO departments(department_name, over_head_costs) VALUES(?, ?)", [
                results.deptName,
                results.overHeadCosts  
            ], (error, results, fields) =>{
             if(error){
                    return console.error(error.message);
                }
                console.log("SQL updated.");
                
            });
            connection.end();
        });
    });
}

// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

// View Product Sales by Department
// Create New Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
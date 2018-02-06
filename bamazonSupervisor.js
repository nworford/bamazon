var mysql = require('mysql');
var prompt = require('inquirer');
var colors = require('colors/safe');
var Table = require('cli-table');

// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

// View Product Sales by Department
// Create New Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
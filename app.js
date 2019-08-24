var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    managerBusiness();
});

function managerBusiness() {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        })
        .then(function(answer) {
            switch(answer.action) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowStock();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break
            }
        });
}

function viewProducts() {

    var q = 'SELECT item_id, product_name, price, stock_quantity FROM products;';
    connection.query(q, function(err, res){
        for(var i=0; i<res.length; i++) {
            console.log(
                `Item ID: ${res[i].item_id} || Item: ${res[i].product_name} || Stock Quant.: ${res[i].stock_quantity}`
            );
        }
        managerBusiness();
    });

}

function viewLowStock() {
    
    var q = 'SELECT * FROM products WHERE stock_quantity < 500;'
    connection.query(q, function(err, res){
        for(var i=0; i<res.length; i++){
            console.log(
                `Item ID: ${res[i].item_id} || Item: ${res[i].product_name} || Stock Quant.: ${res[i].stock_quantity}`
            );
        }
        managerBusiness();
    });

}


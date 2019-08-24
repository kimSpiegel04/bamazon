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
            console.log('================================================');
        }
        managerBusiness();
    });

}

function viewLowStock() {
    
    var q = 'SELECT * FROM products WHERE stock_quantity < 5;'
    connection.query(q, function(err, res){
        for(var i=0; i<res.length; i++){
            console.log(
                `Item ID: ${res[i].item_id} || Item: ${res[i].product_name} || Price: $${res[i].price} Stock Quant.: ${res[i].stock_quantity}`
            );
            console.log('================================================');

        }
        managerBusiness();
    });

}

function addInventory() {

    inquirer
        .prompt([
            {
                name: 'product',
                type: 'input',
                message: 'Select product to add inventory to: ',
            },
            {
                name: 'amount',
                type: 'input',
                message: 'Amount to be added: ',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer){
            var q = `UPDATE products SET stock_quantity = (? + stock_quantity) WHERE product_name = ?;`;
            connection.query(q, [answer.amount, answer.product], function(err, res){
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");
                var updated = `SELECT product_name, stock_quantity FROM products WHERE product_name = ?;`;
                connection.query(updated, [answer.product], function(err,results){
                    console.log('Update successful. New stock quantity for ' + results[0].product_name + ' is ' + results[0].stock_quantity);
                    console.log('================================================');
                });

            managerBusiness();
            });
        });

}

function addProduct() {

    inquirer
        .prompt([
            {
                name: 'product',
                type: 'input',
                message: 'Enter product name: '
            },
            {
                name: 'department',
                type: 'input',
                message: 'Enter department name: '
            },
            {
                name: 'price',
                type: 'input',
                message: 'Enter product price: '
            },
            {
                name: 'stock',
                type: 'input',
                message: 'Enter total in stock: ',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer){
            var q = `INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES(?,?,?,?);`;
            connection.query(q, [answer.product, answer.department, answer.price, answer.stock], function(err, res){
                if (err) throw err;
                var updated = `SELECT * FROM products WHERE product_name = ?;`;
                connection.query(updated, [answer.product], function(err,results){
                    console.log(`Update successful. New product listing: Item ID: ${results[0].item_id} || Item: ${results[0].product_name} || Stock Quant.: ${results[0].stock_quantity}`);
                    console.log('================================================');
                    managerBusiness();
                });

            });
            

        });


}
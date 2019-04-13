var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "h0usTon1",
  database: "bamazon"
});

con.connect(function(err){
    if (err) throw err;
})

function operations(){
    inquirer.prompt([
    {
        name: "action",
        message: "What operation would you like to execute?",
        type: "list",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }
    ])
    .then(function(answers){
        var answer = answers.action;
        switch(answer){
            case "View Products for Sale": console.log("products"), operations()
            break;
            case "View Low Inventory": console.log("low inventory"), operations()
            break;
            case "Add to Inventory": console.log("added inventory"), operations()
            break;
            case "Add New Product": console.log("product added"), operations()
            break;
            case "Exit": con.end()
            break;
        }
    })
}
operations();
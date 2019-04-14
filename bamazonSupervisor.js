var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "h0usTon1",
    database: "bamazon"
});


function view(){

    con.query("SELECT department_name SUM product_sales FROM products GROUP BY department_name",function(err,res){
        if(err) throw err;
        console.table("Stats",res)
    })

    // con.query("SELECT department_id,departments.department_name,over_head_costs,products.product_sales FROM departments LEFT JOIN products on departments.department_name = products.department_name SUM product_sales GROUP BY department_id s",function(err,res){
    //     if(err)throw err;
    //     console.log("\n")
    //     console.table("Department Statistics",res);
    //     command();
    // })

}

function create(){
    inquirer.prompt([
        {
            name: "department",
            message: "What is the name of the new department?",
            type: "input"
        },
        {
            name: "overhead",
            message: "What is the department's overhead cost?",
            type: "input"
        }
    ])
    .then(function(answer){
        var department = answer.department;
        var overhead = parseInt(answer.overhead);
        con.query("INSERT INTO departments SET ?",{
            department_name: department,
            over_head_costs: overhead
        });
        command();

    })
}

function command (){
    inquirer.prompt([
        {
            name: "action",
            message: "What action would you like to execute?",
            type: "list",
            choices:
            [
                "View Product Sales by Department",
                "Create New Department",
                "Exit"
            ]
        }
    ])
    .then(function(answer){
        var answer = answer.action;
        switch(answer){
            case "View Product Sales by Department": view()
            break;
            case "Create New Department": create();
            break;
            case "Exit": con.end()
            break;
        }
    }) 
};

command();

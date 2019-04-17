//Requires the necessary NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

//Creates the connection vairable.
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "h0usTon1",
    database: "bamazon"
});


function view(){

    // con.query("SELECT department_name SUM product_sales FROM products GROUP BY department_name",function(err,res){
    //     if(err) throw err;
    //     console.table("Stats",res)
    // })

    con.query("SELECT department_id,departments.department_name,over_head_costs,SUM(products.product_sales) AS product_sales ,SUM(products.product_sales)-over_head_costs as total_profits FROM departments LEFT JOIN products on departments.department_name = products.department_name GROUP BY department_id ORDER BY department_id",function(err,res){
        if(err)throw err;
        console.log("\n")
        console.table("Department Statistics",res);
        command();
    })


}

//Creates a new department.
function create(){
    //Prompts the user for the necessary info for the fields.
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
        //Saves the answers as a variable/parses as needed.
        var department = answer.department;
        var overhead = parseInt(answer.overhead);
        //Inserts the info into the table.
        con.query("INSERT INTO departments SET ?",{
            department_name: department,
            over_head_costs: overhead
        });
        //Callsback the command function.
        command();

    })
}

//Creates a prompt for the user to select which operation they want to run.
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

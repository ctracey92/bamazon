var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "h0usTon1",
    database: "bamazon"
});
var answersId;
var answersNumber;

function ask (){
    function buy(){
        con.query("SELECT * FROM products WHERE item_id=?",[answersId],function(err,result){
            if(err) throw err;
            var stock = parseInt(result[0].stock_quantity);
            var price = parseInt(result[0].price);
            var stockLeft = stock - answersNumber; 
            var totalPrice = answersNumber * price;
            if(answersNumber>stock){
                console.log("Not enough inventory");
            }
            else{
                con.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[stockLeft,answersId],function(err,res){
                    if (err) throw err;
                })
                console.log("You bought: " + answersNumber + " "+ result[0].product_name + "'s for a total of " + totalPrice + "$" )
            }
            ask();
        })
       }
    inquirer.prompt([
     {
         name: "id",
         message: "What is the ID of the product you would like to buy?",
         type: "input"
     },
     {
        name: "number",
        message: "How many would you like to buy?",
        type: "input"
     }
    ])
    .then(function(answers){
        answersId = parseFloat(answers.id);
        answersNumber = parseFloat(answers.number);
         console.log(answersId + " | " + answersNumber);
         buy();
    })
}

con.connect(function(err){
    if (err) throw err;

    con.query("SELECT * FROM products", function(err,result){
    if (err) throw err;
    for (var i = 0; i < result.length; i++){
        console.log ("ID: " + result[i].item_id + " | " + "Product: " +  result[i].product_name + " | " + "Price: " + result[i].price);
    };
    ask();
    });
})




//Require the necessary NPM packages to run.
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create the connection variable to the database.
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "h0usTon1",
    database: "bamazon"
});
//Set up the global variables to be called later.
var answersId;
var answersNumber;

//The main ask function that will allow the client to interact with the database.
function ask (){
    //The buy function.
    function buy(){
        //Selects the item with the matching id to the user input
        con.query("SELECT * FROM products WHERE item_id=?",[answersId],function(err,result){
            if(err) throw err;
            //The vaaraibles needed for the function.
            var stock = parseInt(result[0].stock_quantity);
            var price = parseInt(result[0].price);
            var stockLeft = stock - answersNumber; 
            var totalPrice = answersNumber * price;
            var sales = parseInt(result[0].product_sales);
            //If not enough product to complete the order, alert the client.
            if(answersNumber>stock){
                console.log("Not enough inventory");
            }
            //Otherwise run the rest of the function.
            else{
                con.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[stockLeft,answersId],function(err,res){
                    if (err) throw err;
                })
                console.log("You bought: " + answersNumber + " "+ result[0].product_name + "'s for a total of " + totalPrice + "$" )
                sales = sales + totalPrice;
                con.query("UPDATE products SET product_sales = ? WHERE item_id = ?",[sales,answersId]),function(err,res){
                    if(err) throw err;
                }
            }
            //Callback the ask function
            ask();
        })
       }
    //Prompt the user for the ID of the product they want to purchase and how many.
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
    //Then parse the answdrs into numbers, and run the buy function.
    .then(function(answers){
        answersId = parseFloat(answers.id);
        answersNumber = parseFloat(answers.number);
         buy();
    })
}

//Create the conenction to the database.
con.connect(function(err){
    if (err) throw err;

    //Selects all of the products and displays them to the console.
    con.query("SELECT * FROM products", function(err,result){
    if (err) throw err;
    for (var i = 0; i < result.length; i++){
        console.log ("ID: " + result[i].item_id + " | " + "Product: " +  result[i].product_name + " | " + "Price: " + result[i].price);
    };
    ask();
    });
})




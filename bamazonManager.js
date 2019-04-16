//Require the NPM packages we will need
var mysql = require("mysql");
var inquirer = require("inquirer");

//Set up the connection vairable.
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "h0usTon1",
  database: "bamazon"
});

//Connect to the database.
con.connect(function(err){
    if (err) throw err;
})

//Function to display the inventory.
function inventory(){
    //Selects all products from the database and displays them.
con.query("SELECT * FROM products", function(err,res){
    if (err) throw err;
    for(var i = 0; i < res.length; i++){
        console.log(
            "Item ID: " + res[i].item_id + " | " +
            "Product: " + res[i].product_name + " | " +
            "Price: " + res[i].price + " | " +
            "Stock: " + res[i].stock_quantity
        )
    };
    console.log("\n\n\n");
    //Calls back the operations function.
    operations();
})

}

//Displays inventory with 5 or less units remaining. 
function lowInventory(){
    //Selects only products with 5 or less units and displays them to the console.
    con.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err,res){
        if (err) throw err;
        console.log("Items with low inventory:")
        for(var i = 0; i < res.length; i++){
        console.log(
            "Item ID: " + res[i].item_id + " | " +
            "Product: " + res[i].product_name + " | " +
            "Price: " + res[i].price + " | " +
            "Stock: " + res[i].stock_quantity
        )
    };
    console.log("\n\n\n")
    //Callsback the operations function.
    operations();
    })
};

//Add to exisiting inventory.
function addInventory(){
    //Prompts the user for the necesary input
    function adder(){
        inquirer.prompt([
            {
                name: "id",
                message: "What is the item id that you wish to add more of?",
                type: "input"
            },
            {
                name: "quantity",
                messgae: "How many would you like to add?",
                type: "input"   
            }
        ])
        .then(function(answers){
            //Parses the answers into numbers and saves as variables. 
            var stock;
            var id = parseFloat(answers.id);  
            var quantity = parseFloat(answers.quantity);

            //Updates the stock item with the matching ID.
            function updateStock(){
                con.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[stock,id],function(err,res){
                if (err) throw err;
                })
            }
                con.query("SELECT stock_quantity FROM products WHERE item_id =?",[id], function(err,result){
                stock = result[0].stock_quantity;
                if(err) throw err;
                stock = stock + quantity;

                //Runs the stock update
                updateStock();
                console.log("Updating stock...\n\n");

                //Callsback the operations vatiable.
                operations();
            });  
        })
    }
    con.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            console.log(
                "Item ID: " + res[i].item_id + " | " +
                "Product: " + res[i].product_name + " | " +
                "Price: " + res[i].price + " | " +
                "Stock: " + res[i].stock_quantity
            )
        };
        console.log("\n\n");
        adder();   
    }) 
      
}

//Add a new product.
function addProduct(){
    //Prompts the user for the necesary fields.
    inquirer.prompt([
        {
            name: "product",
            message: "What is the name of the item?",
            type: "input"
        },
        {
            name: "department",
            message: "What department is the item in?",
            type: "input"
        },
        {
            name: "price",
            message: "What is the price of the item?",
            type: "input"
        },
        {
            name: "quantity",
            message: "What is the quantity of  inventory of the item?",
            type: "input"
        }
    ])
    .then(function(answers){
        //Grabs the answers and saves into variables (parses where needed)
        var product = answers.product;
        var department = answers.department;
        var price = parseInt(answers.price);
        var quantity = parseInt(answers.quantity);
        //Inserts the product into the table.
        con.query("INSERT INTO products SET ?", {
            product_name: product,
            department_name: department,
            price: price,
            stock_quantity: quantity,
        });
        console.log("Adding in product...\n\n");
        //Callsback the operations function.
        operations();
    })
}

//Asks the user which operation they would like to run and then executes it.
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
            case "View Products for Sale": inventory() 
            break;
            case "View Low Inventory": lowInventory();
            break;
            case "Add to Inventory": addInventory();
            break;
            case "Add New Product": addProduct()
            break;
            case "Exit": con.end()
            break;
        }
    })
}
operations();

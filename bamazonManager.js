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

function inventory(){
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
    operations();
})

}

function lowInventory(){
    con.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,res){
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
    operations();
    })
};

function addInventory(){
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
            var stock;
            var id = parseFloat(answers.id);  
            var quantity = parseFloat(answers.quantity);

            function updateStock(){
                con.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[stock,id],function(err,res){
                if (err) throw err;
                })
            }
                con.query("SELECT stock_quantity FROM products WHERE item_id =?",[id], function(err,result){
                stock = result[0].stock_quantity;
                if(err) throw err;
                stock = stock + quantity;

                updateStock();
                console.log("Updating stock...\n\n");
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

function addProduct(){
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
        var product = answers.product;
        var department = answers.department;
        var price = parseInt(answers.price);
        var quantity = parseInt(answers.quantity);
        con.query("INSERT INTO products SET ?", {
            product_name: product,
            department_name: department,
            price: price,
            stock_quantity: quantity,
        });
        console.log("Adding in product...\n\n");
        operations();
    })
}

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

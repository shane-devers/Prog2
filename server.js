var express = require('express');
var app = express();
var recipes = require('./recipes.json');
var bodyParser = require('body-parser');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: false }));

app.get('/recipes', function(req, resp){
    resp.send(recipes);
});

app.post('/new', function(req, resp){
    /*
    let newRecipe = {};
    let today = new Date();
    let m = today.getMonth();
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let month = months[m];
    let day = today.getDate();
    let year = today.getFullYear();
    newRecipe.date = day + " " + month + " " + year;
    newRecipe.creator = "baker213";
    newRecipe.title = req.body.RecipeTitle;
    newRecipe.description = req.body.RecipeDescription;
    let ingredients = req.body.RecipeIngredients;
    let ingredientList = ingredients.split("\r\n");
    let newIngredientList = [];
    for (let i = 0; i < ingredientList.length; i++) {
        newIngredientList.push(ingredientList[i]);
    }
    newRecipe.ingredients = newIngredientList;
    newRecipe.thumbnail = req.body.RecipeThumbnail;
    let complete = true;
    for (const property in newRecipe) {
        if (newRecipe.hasOwnProperty(property)) {
            if (newRecipe[property] == "") {
                complete = false;
            }
        }
    }
    if (complete) {
        recipes.push(newRecipe);
        resp.send(newRecipe);
    } else {
        resp.send("Please complete all fields");
    } 
    */
    let ingredients = req.body.ingredients.split(",");

    let ingredientList = [];
    for (let i = 0; i < ingredients.length; i++) {
        let currentIngredient = ingredients[i];
        currentIngredient = currentIngredient.replace("\\","");
        currentIngredient = currentIngredient.replace('"',"");
        currentIngredient = currentIngredient.replace('"',"");
        currentIngredient = currentIngredient.replace("[","");
        currentIngredient = currentIngredient.replace("]","");
        console.log(currentIngredient);
        ingredientList.push(currentIngredient);
    }
    console.log(ingredientList);
    console.log(req.body);
    let newRecipe = {
        "date" : req.body.date,
        "creator" : req.body.creator,
        "title" : req.body.title,
        "description" : req.body.description,
        "ingredients" : ingredientList,
        "thumbnail" : req.body.thumbnail
    };
    recipes.push(newRecipe);
    resp.send("Recipe successfully added");
});

app.listen(8090);
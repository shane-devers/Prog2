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
    let ingredients = req.body.ingredients.split("\n");
    let newRecipe = {
        "date" : req.body.date,
        "creator" : req.body.creator,
        "title" : req.body.title,
        "description" : req.body.description,
        "ingredients" : ingredients,
        "thumbnail" : req.body.thumbnail
    };
    recipes.push(newRecipe);
    resp.send("Recipe successfully added");
});

app.listen(8090);
var express = require('express');
var app = express();
var recipes = require('./recipes.json');
var bodyParser = require('body-parser');
var fs = require('file-system');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true }));

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
    fs.writeFile('recipes.json', JSON.stringify(recipes));
    resp.send("Recipe successfully added");
});

module.exports = app;

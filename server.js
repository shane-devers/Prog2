var express = require('express');
var app = express();
var recipes = require('./recipes.json');

app.use(express.static('client'));

app.get('/recipes', function(req, resp){
    resp.send(recipes);
});

app.listen(8090);
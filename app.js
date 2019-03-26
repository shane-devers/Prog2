var express = require('express');
var app = express();
var recipes = require('./recipes.json');
//recipes = JSON.parse(recipes);
var bodyParser = require('body-parser');
var fs = require('file-system');
var multer = require('multer');
var upload = multer();

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

app.post('/uploadImage', upload.single("image"), async function(req, resp){
    let formData = req.file.originalname;
    console.log(formData);
    //let fD = new FormData();
    //fD = req.body;
    let img = req.file;
    fs.writeFile('/images/'+img.originalname, img);
    console.log("File should have been written...");
    resp.send("Image uploaded!");
})

module.exports = app;
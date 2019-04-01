var express = require('express');
var app = express();
var recipes = require('./recipes.json');
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
    let ingredients = JSON.parse(req.body.ingredients);
    let directions = req.body.directions.split('\n');
    let newRecipe = {
        "date" : req.body.date,
        "creator" : req.body.creator,
        "title" : req.body.title,
        "description" : req.body.description,
        "ingredients" : ingredients,
        "directions" : directions,
        "thumbnail" : req.body.thumbnail
    };
    recipes.push(newRecipe);
    //fs.writeFile('recipes.json', JSON.stringify(recipes));
    resp.send("Recipe successfully added");
});

app.post('/uploadImage', upload.single("image"), function(req, resp){
    let img = req.file;
    fs.writeFile('client/images/'+img.originalname, img.buffer, 'ascii', (err) => {
        if (err) throw err;
        console.log("File saved successfully!");
    });
    resp.send("Image uploaded!");
})

module.exports = app;
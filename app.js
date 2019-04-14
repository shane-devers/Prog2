var express = require('express');
var app = express();
var recipes = require('./recipes.json');
var userIDName = require('./userIDName.json');
var profiles = require('./profiles.json');
var bodyParser = require('body-parser');
var fs = require('file-system');
var multer = require('multer');
var upload = multer();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true }));

app.get('/recipes/:criteria/:value', function(req, resp){
    console.log(req.params);
    let criteria = req.params.criteria.replace(':','');
    let value = req.params.value.replace(':','');
    let outputRecipes = [];
    if (value == ''){
        outputRecipes = recipes;
    } else {
        for (let i = 0; i < recipes.length; i++) {
            if (matchesCriteria(recipes[i], criteria, value)) {
                outputRecipes.push(recipes[i]);
            }
        }
    }
    resp.send(outputRecipes);
});

function matchesCriteria(recipe, criteria, value){
    if (criteria == 'search') {
        if (recipe.title.toUpperCase().includes(value.toUpperCase())){
            return true;
        } else {
            return false;
        }
    } else if (criteria == 'name') {
        if (recipe.creator == value) {
            return true;
        } else {
            return false;
        }
    } else if (criteria == 'ingredient') {
        let ingredients = JSON.stringify(recipe.ingredients);
        if (ingredients.toUpperCase().indexOf(value.toUpperCase()) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

app.get('/userIDName/:userID', function(req, resp){
    console.log(req.params.userID);
    if (userIDName.hasOwnProperty(req.params.userID)){
        resp.send(true);
    } else {
        resp.send(false);
    }
})

app.get('/profiles/:username', function(req, resp){
    resp.send(profiles[req.params.username]);
})

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
    fs.writeFile('recipes.json', JSON.stringify(recipes));
    resp.send("Recipe successfully added");
});

app.post('/uploadImage', upload.single("image"), function(req, resp){
    let img = req.file;
    fs.writeFile('client/images/'+img.originalname.replace(" ","_"), img.buffer, 'ascii', (err) => {
        if (err) throw err;
        console.log("File saved successfully!");
    });
    resp.send("Image uploaded!");
})

app.post('/addComment', function(req, resp){
    console.log(req.body);
    let i = req.body.recipe;
    let newComment = {
        "author": req.body.author,
        "date": req.body.date,
        "text": req.body.text
    }
    recipes[i].comments.push(newComment);
    fs.writeFile('recipes.json', JSON.stringify(recipes));
    resp.send("Recipe successfully added");
})

app.post('/createProfile', function(req, resp){
    let userID = req.body.userID.toString();
    let username = req.body.username;
    userIDName[userID] = username;
    let newProfile = {
        "recipes": 0,
        "creationDate": req.body.date,
        "profilePicture": req.body.pictureURL
    }
    profiles[username] = newProfile;
    fs.writeFile('userIDName.json', JSON.stringify(userIDName));
    fs.writeFile('profiles.json', JSON.stringify(profiles));
    resp.send("New profile created");
})

module.exports = app;
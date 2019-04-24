var express = require('express');
var app = express();
var recipes = require('./recipes.json');
var userIDName = require('./userIDName.json');
var profiles = require('./profiles.json');
var bodyParser = require('body-parser');
var fs = require('file-system');
var multer = require('multer');
var upload = multer();
var directory = process.env.OPENSHIFT_DATA_DIR || '';


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

app.get('/recipes/search', function(req, resp){
    resp.send(recipes);
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
        resp.send(userIDName[req.params.userID]);
    } else {
        resp.send(false);
    }
})

app.get('/profiles/:username', function(req, resp){
    if (userIDName.hasOwnProperty(req.params.username)) {
    resp.send(profiles[req.params.username]);
    } else {
        resp.send(false);
    }
})

app.get('/profiles', function(req, resp){
    resp.send(profiles);
})

app.post('/new', function(req, resp){
    console.log(directory);
    let ingredients = JSON.parse(req.body.ingredients);
    let directions = req.body.directions.split('\n');
    let newRecipe = {
        "date" : req.body.date,
        "creator" : req.body.creator,
        "title" : req.body.title,
        "description" : req.body.description,
        "ingredients" : ingredients,
        "directions" : directions,
        "thumbnail" : req.body.thumbnail,
        "comments" : []
    };
    recipes.push(newRecipe);
    profiles[req.body.creator].recipes += 1;
    fs.writeFile(directory + 'recipes.json', JSON.stringify(recipes));
    fs.writeFile(directory + 'profiles.json', JSON.stringify(profiles));
    resp.send("Recipe successfully added");
});

app.post('/uploadImage', upload.single("image"), function(req, resp){
    let img = req.file;
    fs.writeFile(directory+'client/images/'+img.originalname.replace(" ","_"), img.buffer, 'ascii', (err) => {
        if (err) throw err;
        console.log("File saved successfully!");
    });
    resp.send("Image uploaded!");
});

app.post('/addComment', function(req, resp){
    console.log(req.body);
    let i = req.body.recipe;
    let newComment = {
        "author": req.body.author,
        "date": req.body.date,
        "text": req.body.text
    }
    recipes[i].comments.push(newComment);
    fs.writeFile(directory+'recipes.json', JSON.stringify(recipes));
    resp.send("Comment successfully added");
});

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
    fs.writeFile(directory+'userIDName.json', JSON.stringify(userIDName));
    fs.writeFile(directory+'profiles.json', JSON.stringify(profiles));
    resp.send("New profile created");
});

app.post('/tokenSignIn', function(req, resp) {
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client('845596870958-sjnd8u9h2togiqlj0e3r7ofg59lc23nr.apps.googleusercontent.com');
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: '845596870958-sjnd8u9h2togiqlj0e3r7ofg59lc23nr.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
        console.log("Userid"+userid);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(console.error);
    resp.send('Someone');
});

module.exports = app;
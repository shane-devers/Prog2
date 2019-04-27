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
    if (criteria == 'search' || criteria == 'name' || criteria == 'ingredient'){
        if (value == ''){
            outputRecipes = recipes;
        } else {
            for (let i = 0; i < recipes.length; i++) {
                if (matchesCriteria(recipes[i], criteria, value)) {
                    outputRecipes.push(recipes[i]);
                }
            }
        }
        resp.status(200);
        resp.send(outputRecipes);
    } else {
        resp.status(404);
        resp.send('Invalid criteria');
    }
});

app.get('/recipes/search', function(req, resp){
    resp.status(200);
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
        resp.status(200);
        resp.send(userIDName[req.params.userID]);
    } else {
        resp.status(404);
        resp.send(false);
    }
});

app.get('/profiles/:username', function(req, resp){
    if (userIDName.hasOwnProperty(req.params.username)) {
        resp.status(200);
        resp.send(profiles[req.params.username]);
    } else {
        resp.status(404);
        resp.send(false);
    }
});

app.get('/profiles', function(req, resp){
    resp.status(200);
    resp.send(profiles);
});

app.post('/new', function(req, resp){
    console.log(directory);
    if (req.body.hasOwnProperty('ingredients') && req.body.hasOwnProperty('directions') && req.body.hasOwnProperty('date') && req.body.hasOwnProperty('creator') && req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('thumbnail')){
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
        //fs.writeFile(directory + 'recipes.json', JSON.stringify(recipes));
        //fs.writeFile(directory + 'profiles.json', JSON.stringify(profiles));
        resp.status(201);
        resp.send('Recipe successfully added');
    } else {
        resp.status(400);
        resp.send('The JSON sent did not contain all of the required fields');
    }
});

app.post('/uploadImage', upload.single('image'), function(req, resp){
    console.log(directory);
    let img = req.file;
    //fs.writeFile(directory+'client/images/'+img.originalname.replace(/ /g,'_'), img.buffer, 'ascii', (err) => {
    //     if (err) throw err;
    //     console.log('File saved successfully!');
    // });
    resp.status(201);
    resp.send('Image uploaded!');
});

app.post('/addComment', function(req, resp){
    console.log(req.body);
    if (req.body.hasOwnProperty('author') && req.body.hasOwnProperty('date') && req.body.hasOwnProperty('text')){
        let i = req.body.recipe;
        let newComment = {
            "author": req.body.author,
            "date": req.body.date,
            "text": req.body.text
        };
        recipes[i].comments.push(newComment);
        //fs.writeFile(directory+'recipes.json', JSON.stringify(recipes));
        resp.status(201);
        resp.send('Comment successfully added');
    } else {
        resp.status(400);
        resp.send('The JSON sent did not contain all of the required fields');
    }
});

app.post('/createProfile', function(req, resp){
    if (req.body.hasOwnProperty('date') && req.body.hasOwnProperty('pictureURL')&& req.body.hasOwnProperty('userID')&& req.body.hasOwnProperty('username')){
        let userID = req.body.userID.toString();
        let username = req.body.username;
        userIDName[userID] = username;
        let newProfile = {
            "recipes": 0,
            "creationDate": req.body.date,
            "profilePicture": req.body.pictureURL
        };
        profiles[username] = newProfile;
        //fs.writeFile(directory+'userIDName.json', JSON.stringify(userIDName));
        //fs.writeFile(directory+'profiles.json', JSON.stringify(profiles));
        resp.status(201);
        resp.send('New profile created');
    } else {
        resp.status(400);
        resp.send('The JSON sent was not valid');
    }
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
        console.log('Userid'+userid);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(console.error);
    resp.status(200);
    resp.send('Someone');
});

module.exports = app;
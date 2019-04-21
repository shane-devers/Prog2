window.fbAsyncInit = function() {
    FB.init({
        appId            : 400507017396771,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.2'
    });
    checkLoginState();
};

let username = '';
let profile = '';

function checkLoginState() {
    FB.getLoginStatus(async function(response) {
        if (response.status === 'connected') {
/*             getName();
            let response2 = await fetch('/userIDName/'+response.authResponse.userID);
            username = response.authResponse.userID;
            let body = await response2.text(); //{"835566406777374":"user163"}
            console.log(body);
            if (body == 'false'){
                document.getElementById('modals').innerHTML += '<div class="ui modal" id="profileModal"><div class="header">Create Profile</div><div class="content"><form class="ui form" method="POST" action="/createProfile" id="createProfile"><div class="field"><label>Username:</label><input type="text placeholder="Username" name="username" id="username"></div><div class="field"><label>Profile Picture</label><input type="file" name="profilePicture" id="profilePicture" accept="image/*"></div><div class="actions"><button class="ui green ok button" type="submit"><i class="checkmark icon"></i>OK</button><button class="ui red basic cancel button" type="button"><i class="remove icon"></i>Cancel</button></div></form></div>'
                $(document).ready(function(){$('#profileModal').modal('show');})
                $(document).ready(function(){document.getElementById('createProfile').addEventListener('submit', function(event){event.preventDefault(); createProfile(response.authResponse.userID);})});
            } else {
                username = body;
            } */
        }
    });
}

async function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    let response2 = await fetch('/userIDName/'+profile.getId());
    username = profile.getId();
    let body = await response2.text(); //{"835566406777374":"user163"}
    console.log(body);
    if (body == 'false'){
        document.getElementById('modals').innerHTML += '<div class="ui modal" id="profileModal"><div class="header">Create Profile</div><div class="content"><form class="ui form" method="POST" action="/createProfile" id="createProfile"><div class="field"><label>Username:</label><input type="text placeholder="Username" name="username" id="username"></div><div class="field"><label>Profile Picture</label><input type="file" name="profilePicture" id="profilePicture" accept="image/*"></div><div class="actions"><button class="ui green ok button" type="submit"><i class="checkmark icon"></i>OK</button><button class="ui red basic cancel button" type="button"><i class="remove icon"></i>Cancel</button></div></form></div>'
        $(document).ready(function(){$('#profileModal').modal('show');})
        $(document).ready(function(){document.getElementById('createProfile').addEventListener('submit', function(event){event.preventDefault(); createProfile(response.authResponse.userID);})});
    } else {
        username = body;
    }
}
  

function getName() {
    let name = '';
    FB.api('/me', function(response) {
        //document.getElementById('Facebook').innerHTML = response.name;
        return response.name;
    });
    return name;
}

document.addEventListener('DOMContentLoaded', async function(event){
    getResults(event, 'search');
    $(document).ready(function(){document.getElementById('NewBtn').addEventListener('click', function(){$('#newRecipe').modal('show');});});
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown.unit').dropdown();
});

$(document).ready(function(){document.getElementById('search').addEventListener('input', async function(event){
    getResults(event, 'search');
});});

async function getResults(event, criteria, name) {
    let query = '';
    if (criteria == 'search'){
        document.getElementById('title').innerHTML = 'Newest Recipes';
        query = document.getElementById('search').value;
    } else if (criteria == 'name') {
        query = name;
    } else if (criteria == 'ingredient') {
        query = name;
    }
    let response = await fetch('/recipes/'+criteria+'/'+query);
    let body = await response.text();
    let recipes = JSON.parse(body);
    let profileResponse = await fetch('/profiles');
    let profileBody = await profileResponse.text();
    let profile = JSON.parse(profileBody);
    document.getElementById('recipes').innerHTML = '';
    document.getElementById('modals').innerHTML = '';
    for (let i = recipes.length-1; i > -1; i--) {
        document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + '</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
        document.getElementById('modals').innerHTML += '<div class="ui modal recipe" id="modal'+i+'"></div>';
        $(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){createModal(recipes, i, profile); $('#modal' + i).modal('show');});});
    }
    if (criteria == 'name'){
    document.getElementById('title').innerHTML ='<div class="ui stackable two column grid"><div class="two wide column"><img class="ui small image" src="'+profile[name].profilePicture+'"></div><div class="column">'+name+"'s Recipes"+'</div></div><h3><div class="ui stackable two column grid"><div class="two wide column">Recipes: '+profile[name].recipes+'</div><div class="column">Creation Date: '+profile[name].creationDate+'</div></div></h3>';
    }
}

function createModal(recipes, i, profiles) {
    let unitSystem = $('.ui.dropdown.unit').dropdown('get value') || 'metric';//document.getElementById('unitSelect').innerText.replace(" ","");
    let newUnits = [];
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
        let value = recipes[i].ingredients[j].quantity;
        let unit = recipes[i].ingredients[j].unit;
        let inSystem = '';
        if (['g', 'kg', 'l', 'ml'].indexOf(unit) != -1) {
            inSystem = 'metric';
        } else if (unit != 'No Units') {
            inSystem = 'imperial';
        }
        newUnits.push(convertUnits(inSystem, unitSystem, value, unit));
    }
    document.getElementById('modal'+i).innerHTML = '<div class="header">'+recipes[i].title+'<br>Creator: <a href="#" id="creator'+i+'">' + recipes[i].creator + '</a></div><i class="close icon"></i><div class="scrolling content" id="scroll'+ i+'">';
    $(document).ready(function(){document.getElementById('creator'+i).addEventListener('click', function(event){getResults(event,'name',recipes[i].creator); $('.ui.modal').modal('hide'); $('.ui.modal.recipe.scrolling').remove();});});
    let scroll = '<img class="ui medium image" src="'+recipes[i].thumbnail+'"><br><p><h3 class="ui dividing header">Ingredients</h3><ul>';
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
        scroll += '<li><a id="' + recipes[i].title + '-' + j + '" href="#">' + newUnits[j] + ' ' + recipes[i].ingredients[j].ingredient + '</a><br></li>';
        $(document).ready(function(){document.getElementById(recipes[i].title + '-' + j).addEventListener('click', function(event){getResults(event,'ingredient',recipes[i].ingredients[j].ingredient); $('.ui.modal').modal('hide'); document.getElementById('title').innerHTML = 'Newest Recipes containing "' + recipes[i].ingredients[j].ingredient + '"'; $('.ui.modal.recipe.scrolling').remove();});});
    }
    scroll += '</ul></p><p><h3 class="ui dividing header">Directions</h3><ol>';
    for (let j = 0; j < recipes[i].directions.length; j++) {
        scroll += '<li>' + recipes[i].directions[j] + '<br></li>';
    }
    scroll += '</ol></p><div class="ui comments"><h3 class="ui dividing header">Comments</h3>';
    for (let j = 0; j < recipes[i].comments.length; j++) {
        scroll += '<div class="comment"><a class="avatar"><img src="'+profiles[recipes[i].creator].profilePicture+'"></a><div class="content"><a class="author" id="'+i+'author'+j+'">'+recipes[i].comments[j].author+'</a><div class="metadata"><span class="date">'+recipes[i].comments[j].date+'</span></div><div class="text">'+recipes[i].comments[j].text+'</div><div class="actions"><a class="reply">Reply</a></div></div></div>';
        $(document).ready(function(){document.getElementById(i+'author'+j).addEventListener('click', function(event){getResults(event,'name',recipes[i].creator); $('.ui.modal').modal('hide'); $('.ui.modal.recipe.scrolling').remove();})});
    }
    scroll += '<form class="ui reply form" method="POST" action="/addComment" id="commentForm'+i+'"><div class="field"><textarea id="commentBox'+i+'"></textarea></div><button class="ui blue labeled submit icon button" type="submit"><i class="icon edit"></i>Add Comment</button></form><br><br></div></div>';
    document.getElementById('scroll'+i).innerHTML = scroll;
    $(document).ready(function(){document.getElementById('commentForm'+i).addEventListener('submit', function(event){addComment(event, i);})});
}

async function addComment(event, i) {
    console.log(i);
    event.preventDefault();
    let date = getDate();
    /*                 if (document.getElementById('Facebook').innerHTML.indexOf('fb-login') != -1){
        throw new Error('Please log in to add a new recipe!');
    } */
    let creator = document.getElementById('Facebook').innerHTML;
    let text = document.getElementById('commentBox'+i).value;
    /*     let newComment = {
        "author": creator,
        "date": date,
        "text": document.getElementById('commentBox'+i).value
    } */
    let response = await fetch('/addComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'date=' + date + '&author=' + creator + '&text=' + text + '&recipe=' + i
    });
    if (!response.ok) {
        throw new Error('problem adding recipe' + response.code);
    }
}

function getDate() {
    let today = new Date();
    let m = today.getMonth();
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let month = months[m];
    let day = today.getDate();
    let year = today.getFullYear();
    let date = day + ' ' + month + ' ' + year;
    return date;
}

function convertUnits(input, output, value, unit){
    if (input == output) {
        if (unit != 'No Units'){
            return value + ' ' + unit;
        } else {
            return value;
        }
    } else {
        let amount = 0;
        switch (unit) {
        case 'cups':
            amount = value * 236.588;
            if (amount >= 1000) {
                return (amount/1000).toFixed(2) + ' l';
            } else {
                return Math.round(amount) + ' ml';
            }
        case 'fl oz':
            amount = value * 28.413;
            if (amount >= 1000) {
                return (amount/1000).toFixed(2) + ' l';
            } else {
                return Math.round(amount) + ' ml';
            }
        case 'l':
            amount = value * 35.195;
            return amount.toFixed(2) + ' fl oz';
        case 'ml':
            amount = value / 28.413;
            return amount.toFixed(2) + ' fl oz';
        case 'oz':
            amount = value * 28.35;
            return Math.round(amount) + ' g';
        case 'lb':
            amount = value * 453.592;
            if (amount >= 1000) {
                return (amount/1000).toFixed(2) + ' kg';
            } else {
                return Math.round(amount) + ' g';
            }
        case 'g':
            amount = value / 28.35;
            if (amount >= 16) {
                return (amount/16).toFixed(2) + ' lb';
            } else {
                return amount.toFixed(2) + ' oz';
            }
        case 'kg':
            amount = value * 2.205;
            return amount.toFixed(2) + ' lb';
        case 'No Units':
            return value;
        default:
            return value + ' ' + unit;
        }
    }
}

$(document).ready(function(){document.getElementById('addRecipe').addEventListener('submit', async function(event){
    event.preventDefault();
    try {
        FB.getLoginStatus(function(response){
            if (response.status === 'connected') {
                submitValues();
            } else {
                throw new Error('Please log in to add a new recipe!');
            }
        });
    } catch (error) {
        alert(error);
    }
});});

async function submitValues() {
    let date = getDate();
    /*                 if (document.getElementById('Facebook').innerHTML.indexOf('fb-login') != -1){
        throw new Error('Please log in to add a new recipe!');
    } */
    let creator = username;
    let title = document.getElementById('RecipeTitle').value;
    let description = document.getElementById('RecipeDescription').value;
    let ingredients = [];
    for (let i = 0; i < document.getElementsByClassName('ui dropdown label').length-1; i++) {
        let newIngredient = {
            'quantity': document.getElementById('Quantity'+i).value,
            'unit': document.getElementById('Unit'+i).innerText,
            'ingredient': document.getElementById('Ingredient'+i).value
        };
        ingredients.push(newIngredient);
    }
    let directions = document.getElementById('RecipeDirections').value;
    let thumbnail = document.getElementById('RecipeThumbnail').files[0];
    let xhr = new XMLHttpRequest();
    let fD = new FormData();
    fD.append('image', thumbnail);
    xhr.open('POST', '/uploadImage');
    xhr.send(fD);
    let response = await fetch('/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'date=' + date + '&creator=' + creator + '&title=' + title + '&description=' + description + '&ingredients=' + JSON.stringify(ingredients) + '&directions=' + directions + '&thumbnail=images/' + thumbnail.name
    });
    if (!response.ok) {
        throw new Error('problem adding recipe' + response.code);
    }
    getResults(event, 'search');
}

async function createProfile(userID) {
    let date = getDate();
    let username = document.getElementById('username').value;
    let profilePicture = document.getElementById('profilePicture').files[0];
    let xhr = new XMLHttpRequest();
    let fD = new FormData();
    fD.append('image', profilePicture);
    xhr.open('POST', '/uploadImage');
    xhr.send(fD);
    let response = await fetch('/createProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'userID='+userID + '&username='+username + '&date=' + date + '&pictureURL=images/' + profilePicture.name.replace(' ','_')
    });
    if (!response.ok) {
        throw new Error('problem adding recipe' + response.code);
    }
}

$(document).ready(function(){document.getElementById('home').addEventListener('click', function(event) {getResults(event,'search'); document.getElementById('title').innerHTML = 'Newest Recipes';});});

//$(document).ready(function(){document.getElementById('dropdown').addEventListener('click', function(event) {$('.ui.dropdown').dropdown();})});

$(document).ready(function(){document.getElementById('AddIngredient').addEventListener('click', function(){let i = document.getElementsByClassName('ui dropdown label').length - 1; 
let contents = [];
for (let j = 0; j < i; j++) {
    let newItem = {
        'quantity': document.getElementById('Quantity'+j).value,
        'ingredient': document.getElementById('Ingredient'+j).value
    }
    contents.push(newItem);
}
document.getElementById('IngredientField').innerHTML += '<div class="left floated eight wide column"><div class="ui right labeled input" id="Unit'+i+'"><input type="text" placeholder="Quantity" id="Quantity'+i+'"><div class="ui dropdown label" id="dropdown' + i + '"><div class="text">No Units</div><i class="dropdown icon"></i><div class="menu"><div class="item">No Units</div><div class="item">g</div><div class="item">kg</div><div class="item">oz</div><div class="item">lb</div><div class="item">ml</div><div class="item">l</div><div class="item">fl oz</div><div class="item">cups</div><div class="item">tsp</div><div class="item">tbsp</div></div></div></div></div><div class="right floated eight wide column"><div class="ui input"><input type="text" placeholder="Ingredient" id="Ingredient'+i+'"></div></div>';$('.ui.dropdown').dropdown();
for (let j = 0; j < i; j++) {
    document.getElementById('Quantity'+j).value = contents[j].quantity;
    document.getElementById('Ingredient'+j).value = contents[j].ingredient;
}
});}); //document.getElementById('dropdown'+i).addEventListener('click', function() {$('.ui.dropdown').dropdown();
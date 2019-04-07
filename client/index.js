window.fbAsyncInit = function() {
    FB.init({
        appId            : 400507017396771,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.2'
    });
    checkLoginState();
};

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            getName();
        }
    });
}

function getName() {
    let name = '';
    FB.api('/me', function(response) {
        document.getElementById('Facebook').innerHTML = response.name;
        return response.name;
    });
    return name;
}

document.addEventListener('DOMContentLoaded', async function(event){
    getResults(event, 'search');
    $(document).ready(function(){document.getElementById('NewBtn').addEventListener('click', function(){$('#newRecipe').modal('show');});});
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown.unit').dropdown();
    $('.ui.dropdown.unit').dropdown('setting', 'onChange', function(){getResults(event, 'search');});
});

$(document).ready(function(){document.getElementById('search').addEventListener('input', async function(event){
    getResults(event, 'search');
});});

async function getResults(event, criteria, name) {
    let response = await fetch('/recipes');
    let body = await response.text();
    let recipes = JSON.parse(body);
    let query = '';
    if (criteria == 'search'){
        query = document.getElementById('search').value;
    } else if (criteria == 'name') {
        query = name;
    } else if (criteria == 'ingredient') {
        query = name;
    }
    document.getElementById('recipes').innerHTML = '';
    document.getElementById('modals').innerHTML = '';
    for (let i = recipes.length-1; i > -1; i--) {
        if (matchesCriteria(recipes[i], criteria, query)){
            document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + '</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
            document.getElementById('modals').innerHTML += '<div class="ui modal" id="modal'+i+'"></div>';
            $(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){createModal(recipes, i); $('#modal' + i).modal('show');});});
        }
    }
}

function createModal(recipes, i) {
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
    $(document).ready(function(){document.getElementById('creator'+i).addEventListener('click', function(event){getResults(event,'name',recipes[i].creator);document.getElementById('title').innerHTML = recipes[i].creator +"'s Recipes"; $('#modal'+i).modal('hide');});});
    let scroll = '<img class="ui medium image" src="'+recipes[i].thumbnail+'"><br><p><strong>Ingredients:</strong><br><ul>';
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
        scroll += '<li><a id="' + recipes[i].title + '-' + j + '">' + newUnits[j] + ' ' + recipes[i].ingredients[j].ingredient + '</a><br></li>';
        $(document).ready(function(){document.getElementById(recipes[i].title + '-' + j).addEventListener('click', function(event){getResults(event,'ingredient',recipes[i].ingredients[j].ingredient);});});
    }
    scroll += '</ul></p><br><p><strong>Directions:</strong><br><ol>';
    for (let j = 0; j < recipes[i].directions.length; j++) {
        scroll += '<li>' + recipes[i].directions[j] + '<br></li>';
    }
    scroll += '</ol></p></div>';
    document.getElementById('scroll'+i).innerHTML = scroll;
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
    let today = new Date();
    let m = today.getMonth();
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let month = months[m];
    let day = today.getDate();
    let year = today.getFullYear();
    let date = day + ' ' + month + ' ' + year;
    /*                 if (document.getElementById('Facebook').innerHTML.indexOf('fb-login') != -1){
        throw new Error('Please log in to add a new recipe!');
    } */
    let creator = document.getElementById('Facebook').innerHTML;
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

$(document).ready(function(){document.getElementById('home').addEventListener('click', function(event) {getResults(event,'search'); document.getElementById('title').innerHTML = 'Newest Recipes';});});

//$(document).ready(function(){document.getElementById('dropdown').addEventListener('click', function(event) {$('.ui.dropdown').dropdown();})});

$(document).ready(function(){document.getElementById('AddIngredient').addEventListener('click', function(){let i = document.getElementsByClassName('ui dropdown label').length - 1; document.getElementById('IngredientField').innerHTML += '<div class="left floated eight wide column"><div class="ui right labeled input" id="Unit'+i+'"><input type="text" placeholder="Quantity" id="Quantity'+i+'"><div class="ui dropdown label" id="dropdown' + i + '"><div class="text">No Units</div><i class="dropdown icon"></i><div class="menu"><div class="item">No Units</div><div class="item">g</div><div class="item">kg</div><div class="item">oz</div><div class="item">lb</div><div class="item">ml</div><div class="item">l</div><div class="item">fl oz</div><div class="item">cups</div><div class="item">tsp</div><div class="item">tbsp</div></div></div></div></div><div class="right floated eight wide column"><div class="ui input"><input type="text" placeholder="Ingredient" id="Ingredient'+i+'"></div></div>';$('.ui.dropdown').dropdown();});}); //document.getElementById('dropdown'+i).addEventListener('click', function() {$('.ui.dropdown').dropdown();
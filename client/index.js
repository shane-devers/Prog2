document.addEventListener('DOMContentLoaded', async function(event){
    getResults(event, "search");
    $(document).ready(function(){document.getElementById('NewBtn').addEventListener('click', function(){$('#newRecipe').modal('show');})})
});

$(document).ready(function(){document.getElementById('search').addEventListener('input', async function(event){
    getResults(event, "search");
})});

async function getResults(event, criteria, name) {
    let response = await fetch('/recipes');
    let body = await response.text();
    let recipes = JSON.parse(body);
    let query = "";
    if (criteria == "search"){
        query = document.getElementById('search').value;
    } else if (criteria == "name") {
        query = name;
    } else if (criteria == "ingredient") {
        let ingredAmount = name.split(" ");
        query = ingredAmount[1];
    }
    document.getElementById('recipes').innerHTML = "";
    document.getElementById('modals').innerHTML = "";
    for (let i = recipes.length-1; i > -1; i--) {
        if (matchesCriteria(recipes[i], criteria, query)){
            document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + '</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
            document.getElementById('modals').innerHTML += '<div class="ui modal" id="modal'+i+'"><div class="header">'+recipes[i].title+'<br>Creator: <a href="#" id="creator'+i+'">' + recipes[i].creator + '</a></div><img class="ui medium image" src="'+recipes[i].thumbnail+'"><div class="scrolling content" id="scroll'+ i+'">';
            $(document).ready(function(){document.getElementById("creator"+i).addEventListener("click", function(event){getResults(event,"name",recipes[i].creator);document.getElementById('title').innerHTML = recipes[i].creator +"'s Recipes"; $('#modal'+i).modal('hide');})});
            let scroll = '<p><strong>Ingredients:</strong><br><ul>';
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                scroll += '<li><a id="' + recipes[i].title + j + '">' + recipes[i].ingredients[j] + '</a><br></li>';
                $(document).ready(function(){document.getElementById(recipes[i].title + j).addEventListener('click', function(event){getResults(event,"ingredient",recipes[i].ingredients[j]);})});
            }
            scroll += '</ul></p></div>';
            document.getElementById('scroll'+i).innerHTML = scroll;
            $(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){$('#modal' + i).modal('show');})})
        }
    }
}

function matchesCriteria(recipe, criteria, value){
    if (criteria == "search") {
        if (recipe.title.toUpperCase().includes(value.toUpperCase())){
            return true;
        } else {
            return false;
        }
    } else if (criteria == "name") {
        if (recipe.creator == value) {
            return true;
        } else {
            return false;
        }
    } else if (criteria == "ingredient") {
        if (recipe.ingredients.join("").indexOf(value) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

$(document).ready(function(){document.getElementById('addRecipe').addEventListener('submit', async function(event){
    event.preventDefault();
    try {
        let today = new Date();
        let m = today.getMonth();
        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let month = months[m];
        let day = today.getDate();
        let year = today.getFullYear();
        let date = day + " " + month + " " + year;
        if (document.getElementById('Facebook').innerHTML.indexOf('fb-login') != -1){
            throw new Error("Please log in to add a new recipe!");
        }
        console.log(document.getElementById('RecipeThumbnail'));
        let creator = document.getElementById('Facebook').innerHTML; //"baker213";
        let title = document.getElementById('RecipeTitle').value;
        let description = document.getElementById('RecipeDescription').value;
        let ingredients = {};
        console.log(document.getElementsByClassName('.ui.dropdown').length);
        for (let i = 0; i < document.getElementsByClassName('.ui.dropdown.label').length; i++) {
            let newIngredient = {
                "quantity": document.getElementById('Quantity'+i).value,
                "unit": document.getElementById('Unit'+i).innerText,
                "ingredient": document.getElementById('Ingredient'+i).value
            };
            ingredients.push(newIngredient);
        }
        let thumbnail = document.getElementById('RecipeThumbnail').files[0];
        let xhr = new XMLHttpRequest();
        let fD = new FormData();
        fD.append("image", thumbnail);
        console.log(fD);
        xhr.open("POST", "/uploadImage");
        //xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(fD);
        console.log(fD.get("image"));
/*         let imgResponse = await fetch('/uploadImage', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "image=" + thumbnail
        }); */
        let response = await fetch('/new', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "date=" + date + "&creator=" + creator + "&title=" + title + "&description=" + description + "&ingredients=" + ingredients + "&thumbnail=images/" + thumbnail.name
        });
        getResults(event, "search");
        if (!response.ok) {
            throw new Error("problem adding recipe" + response.code);
        }
    } catch (error) {
        alert(error);
    }
})});

$(document).ready(function(){document.getElementById('home').addEventListener('click', function(event) {getResults(event,"search"); document.getElementById('title').innerHTML = "Newest Recipes";})});

$(document).ready(function(){document.getElementById('dropdown').addEventListener('click', function(event) {$('.ui.dropdown').dropdown();})});

$(document).ready(function(){document.getElementById('AddIngredient').addEventListener('click', function(){let i = document.getElementsByClassName('.ui.dropdown').length; document.getElementById('IngredientField').innerHTML += '<div class="six wide column"><div class="ui right labeled input" id="Unit'+i+'"><input type="text" placeholder="Quantity" id="Quantity'+i+'"><div class="ui dropdown label" id="dropdown' + i + '"><div class="ui dropdown" id="dropdown2"><div class="text">No Units</div><i class="dropdown icon"></i><div class="menu"><div class="item">No Units</div><div class="item">g</div><div class="item">kg</div><div class="item">oz</div><div class="item">lb</div><div class="item">ml</div><div class="item">l</div><div class="item">fl oz</div><div class="item">cups</div><div class="item">tsp</div><div class="item">tbsp</div></div></div></div></div></div><div class="eight wide column"><div class="ui input"><input type="text" placeholder="Ingredient" id="Ingredient'+i+'"></div></div>';document.getElementById('dropdown'+i).addEventListener('click', function() {$('.ui.dropdown').dropdown();})})})
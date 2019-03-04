document.addEventListener('DOMContentLoaded', async function(event){
    getResults(event);
    //let response = await fetch('http://127.0.0.1:8090/recipes');
    //let body = await response.text();
    //let recipes = JSON.parse(body);
    //for (let i = 0; i < recipes.length; i++) {
      //  document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + //'</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
        //document.getElementById('modals').innerHTML += '<div class="ui modal" id="modal'+i+'"><div class="header">'+recipes[i].title+'</div><img class="ui medium image" src="'+recipes[i].thumbnail+'"><div class="scrolling content" id="scroll'+ i+'">';
        //let scroll = '<p><strong>Ingredients:</strong><br><ul>';
        //for (let j = 0; j < recipes[i].ingredients.length; j++) {
         //   scroll += '<li>' + recipes[i].ingredients[j] + '<br></li>';
        //}
        //scroll += '</ul></p></div>';
        //document.getElementById('scroll'+i).innerHTML = scroll;
        //$(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){$('#modal' + i).modal('show');})})
    //}
    //$(document).ready(function(){document.getElementById('NewBtn').addEventListener('click', function(){$('#newRecipe').modal('show');})})
});

$(document).ready(function(){document.getElementById('search').addEventListener('input', async function(event){
    getResults(event);
    /*
    let response = await fetch('http://127.0.0.1:8090/recipes');
    let body = await response.text();
    let recipes = JSON.parse(body);
    let query = document.getElementById('search').value;
    document.getElementById('recipes').innerHTML = "";
    document.getElementById('modals').innerHTML = "";
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].title.toUpperCase().includes(query.toUpperCase())){
            document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + '</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
            document.getElementById('modals').innerHTML += '<div class="ui modal" id="modal'+i+'"><div class="header">'+recipes[i].title+'</div><img class="ui medium image" src="'+recipes[i].thumbnail+'"><div class="scrolling content" id="scroll'+ i+'">';
            let scroll = '<p><strong>Ingredients:</strong><br><ul>';
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                scroll += '<li><a id="' + recipes[i].title + j + '">' + recipes[i].ingredients[j] + '</a><br></li>';
                document.getElementById(recipes[i].title+j).addEventListener('click', async function(event){
                    
                })
            }
            scroll += '</ul></p></div>';
            document.getElementById('scroll'+i).innerHTML = scroll;
            $(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){$('#modal' + i).modal('show');})})
        }
    }*/
})});

async function getResults(event) {
    let response = await fetch('http://127.0.0.1:8090/recipes');
    let body = await response.text();
    let recipes = JSON.parse(body);
    let query = document.getElementById('search').value;
    document.getElementById('recipes').innerHTML = "";
    document.getElementById('modals').innerHTML = "";
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].title.toUpperCase().includes(query.toUpperCase())){
            document.getElementById('recipes').innerHTML += '<div class="card" id="' + recipes[i].title + '"><div class="image"><img src=' + recipes[i].thumbnail + '></div><div class="content"><div class="header">' + recipes[i].title + '</div><div class="description">' + recipes[i].description + '</div></div><div class="extra content"><span class="right floated">' + recipes[i].date + '</span><span><i class="user icon"></i>' + recipes[i].creator + '</span></div></div>';
            document.getElementById('modals').innerHTML += '<div class="ui modal" id="modal'+i+'"><div class="header">'+recipes[i].title+'</div><img class="ui medium image" src="'+recipes[i].thumbnail+'"><div class="scrolling content" id="scroll'+ i+'">';
            let scroll = '<p><strong>Ingredients:</strong><br><ul>';
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                scroll += '<li><a id="' + recipes[i].title + j + '">' + recipes[i].ingredients[j] + '</a><br></li>';
                $(document).ready(function(){document.getElementById(recipes[i].title + j).addEventListener('click', function(event){getResults(event);})});
            }
            scroll += '</ul></p></div>';
            document.getElementById('scroll'+i).innerHTML = scroll;
            $(document).ready(function(){document.getElementById(recipes[i].title).addEventListener('click', function(){$('#modal' + i).modal('show');})})
        }
    }
}
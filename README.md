# Prog2
Programming Summative Assignment 2 - website

## Using the site
The interface of the website is rather basic. At the top there is a menu bar with the website's name and the Google log in button. Below this there is a space for the title of this particular page. Next there is the add new recipe button, which allows the user to upload a new recipe to the website in a modal. Beside this there is a search button, which allows the user to search for all/part of a recipe title. Next to this there is the unit selector, where the user can select whether they want ingredients to be listed using metric or imperial units. Finally, below this, there are the cards listing the recipes on the site. 

### Google Sign In
This button allows the user to sign in using a Google account. The first time a user logs in using a Google account, they will be prompted to create a username and choose a profile picture for their account. Users need to be logged in in order to upload new recipes to the site.

### Add New Recipe
This button brings up a modal which allows the user to enter the details of a new recipe they wish to upload to the website. They need to add the title, description, ingredients (with quantities and units), directions, and a picture of the thing being made. When the OK button is clicked, the site checks that the user is logged in and if so, uploads the recipe to the server, otherwise it informs the user that they must sign in before uploading a recipe.

### Search Bar
Recipes whose titles contain the string entered into the search bar will be returned.

### Unit Selector
Metric or Imperial units can be selected to be shown for all recipes. Units are converted based on the unit selected by the user who added the recipe, into the equivalent unit in the other measurement system. This conversion is done in the ConvertUnits function in the index.js file.

### Recipe Cards
The recipe cars contain the image associated with the recipe, its title, its description, the username of the uploader and the date the recipe was uploaded. Clicking on the card will bring up a modal that lists the details of the recipe. At the top there is the title and username of the uploader. Below this there is the picture of the recipe, then the list of ingredients used in the recipe. Clicking on the ingredients will close the modal and bring up a list of recipes that contain the selected ingredient. Below the ingredients there is a list of directions on how to cook the recipe. Finally, there is the comments section, which allows the user to view previously made comments on the recipe and upload one of their own.

## Using the API

### List all recipes
GET /recipes/search
#### Parameters
None
#### Response
200
##### Headers
Content-Type:application/json
##### Body
[\
    {\
        "date": "25 March 2019",\
        "creator": "user163",\
        "title": "Cheesecake",\
        "description": "A generic cheesecake recipe",\
        "ingredients":\
        "directions":\
        "thumbnail": "images/Ultimate-Cheesecake-Square.jpg",\
        "comments":\
    },\
]\

### List recipes by criteria
GET /recipes/:criteria/:value
#### Parameters
|Parameter|Meaning|Domain|
|---|---|---|
|criteria|The property being filtered|search/name/ingredient|
|value|The required value for the criteria|string|
#### Response
200
##### Headers
Content-Type:application/json
##### Body
[\
    {\
        "date": "25 March 2019",\
        "creator": "user163",\
        "title": "Cheesecake",\
        "description": "A generic cheesecake recipe",\
        "ingredients":\
        "directions":\
        "thumbnail": "images/Ultimate-Cheesecake-Square.jpg",\
        "comments":\
    },\
]\
404
"Invalid criteria!"

### Get username from UserID
GET /userIDName/:userID
#### Parameters
|Parameter|Meaning|
|---|---|
|userID|The userID of the logged in user|
#### Response
200
##### Headers
Contents-Type:text/html
##### Body
"user163"
404
"false"

### Get all profiles
GET /profiles
#### Parameters
None
#### Response
200
##### Headers
Content-Type:application/json
##### Body
{\
    "user163":{\
        "recipes":8,\
        "creationDate":"14 April 2019",\
        "profilePicture":"images/Screenshot_from_2019-01-16_16-38-41.png"\
    },\
    "baker213":{\
        "recipes":3,\
        "creationDate":"25 February 2019",\
        "profilePicture":"images/image1.jpg"\
    }\
}

### Get profile details from username
GET /profiles/:username
#### Parameters
|Parameter|Meaning|
|---|---|
|username|The username of the user about which you want to know details|
#### Response
200
##### Headers
Content-Type:application/json
##### Body
{\
    "recipes":8,\
    "creationDate":"14 April 2019",\
    "profilePicture":"images/Screenshot_from_2019-01-16_16-38-41.png"\
}\
404
"false"

### Post new recipe
POST /new
#### Parameters
None
#### Request
##### Headers
Content-Type:application/x-www-form-urlencoded
##### Body
date=26 April 2019&creator=user163&title=Cheesecake5&description=Yet another cheesecake for you to enjoy&ingredients=[{"quantity":"200","unit":"g","ingredient":"Cheese"},{"quantity":"300","unit":"g","ingredient":"Flour"},{"quantity":"3","unit":"No Units","ingredient":"Eggs"}]&directions=["Put stuff into bowl", "Cook for 20 minutes", "Eat"]&thumbnail=images/image1.jpg&idtoken=771432029351092430192830
#### Response
|Code|Body|
|---|---|
|201|"Recipe successfully added"|
|400|"All recipe properties must have a value!"|
|400|"The JSON sent did not contain all of the required fields"|
|401|"You must be logged in to add a new recipe!"|

### Upload image
POST /uploadImage
#### Parameters
None
#### Request
##### Headers
Content-Type: text/html; charset=utf-8
##### Body
(Image encoded in utf-8 format)
idtoken=771432029351092430192830
#### Response
|Code|Body|
|---|---|
|201|"Image uploaded!"|
| |Location: /images/{filename}|
|401|"You must be logged in to upload an image!"|

### Add comment
POST /addComment
#### Parameters
None
#### Request
##### Headers
Content-Type:application/x-www-form-urlencoded
##### Body
date=26 April 2019&author=baker213&text=Tasty recipe! Thanks&recipe=6&idtoken=771432029351092430192830
#### Response
|Code|Body|
|---|---|
|201|"Comment successfully added!"|
|400|"The JSON sent did not contain all of the required fields"|
|401|"You must be logged in to add a comment!"|

### Create new profile
POST /createProfile
#### Parameters
None
#### Request
##### Headers
Content-Type:application/x-www-form-urlencoded
##### Body
userID=115240131475881817498&username=user163&date=26 April 2019&pictureURL=images/image1.jpg&idtoken=771432029351092430192830
#### Response
|Code|Body|
|---|---|
|201|"New profile created!"|
|   |Location: /profiles/{username}|
|400|"The JSON sent was not valid"|
|401|"You must be signed in to a Google account in order to create a profile for this website"|

### Token sign in
POST /tokenSignIn
#### Parameters
None
#### Request
##### Headers
Content-Type:application/x-www-form-urlencoded
##### Body
idToken=9238049823234
#### Response
|Code|Body|
|---|---|
|200|"User authenticated"|
|401|"Invalid ID token"|
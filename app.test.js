'use strict';
const request = require('supertest');
const app = require("./app");


describe("Test recipes service", () => {
    test("GET /recipes/search succeeds", () => {
        return request(app)
        .get("/recipes/search")
        .expect(200);
    });

    test("GET /recipes/search returns JSON", () => {
        return request(app)
        .get("/recipes/search")
        .expect("Content-type", /json/);
    });

    test("GET /recipes/search includes chocolate cake", () => {
        return request(app)
        .get("/recipes/search")
        .expect(/Chocolate Cake/);
    });

    test("GET /userIDName/115240131475881817498 returns html/text", () => {
        return request(app)
        .get("/userIDName/115240131475881817498")
        .expect("Content-type", /html/);
    });

    test("GET /userIDName/acx (not in userIDName.json) returns false", () => {
        return request(app)
        .get("/userIDName/acx")
        .expect('false');
    });

    test("GET /profiles returns JSON", () => {
        return request(app)
        .get("/profiles")
        .expect("Content-type", /json/);
    });

    test("GET /profiles/user163 returns JSON", () => {
        return request(app)
        .get("/profiles/user163")
        .expect("Content-type", /json/);
    });

    test("GET /profiles/noone cannot be found", async() => {
        try {
            await request(app)
            .get("/profiles/noone");
        } catch(error) {
            expect(error.message).toBe('Not Found');
        }    
    });

    test("Add new recipe", async() => {
        const ingredients = [{"quantity":"2", "units":"No Units", "ingredient":"Eggs"}, {"quantity":"200", "units":"g", "ingredient":"flour"}];
        const directions = ["Preheat an oven to 200C", "Combine the eggs and the flour in a large bowl", "Place in a baking tray and cook for 20 minutes", "Leave to cool for 5 minutes before serving"]
        const body2 = {
            "idtoken":12,
            "date":"23 April 2019",
            "creator":"baker213",
            "title":"Test Recipe",
            "description":"A basic recipe for something",
            "ingredients":JSON.stringify(ingredients),
            "directions":JSON.stringify(directions),
            "thumbnail":"https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
        jest.mock('./app', () => ({
            tokenSignIn: () => true,
        }));
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        .expect("Recipe successfully added");
    });

    test("Add new comment", async() => {
        const toSend = {
            "date":"24 April 2019",
            "author":"baker213",
            "text":"Great recipe! Thanks for sharing",
            "recipe":0
        }
        await request(app)
        .post('/addComment')
        .type('form')
        .send(toSend)
        .expect("Comment successfully added");
    });

    test("Create new profile", async() => {
        const toSend = {
            "userID":"827146914025046",
            "username":"newUser3",
            "date":"24 April 2019",
            "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
        }
        await request(app)
        .post('/createProfile')
        .type('form')
        .send(toSend)
        .expect("New profile created");
    });

    test("Create new profile without all required data values", async() => {
        const toSend = {
            "userID":"01285239523234",
            "date":"27 April 2019",
            "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
        }
        const response = await request(app)
        .post('/createProfile')
        .type('form')
        .send(toSend);
        expect(response).toThrow();
    });
});
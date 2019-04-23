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

    test("GET /profiles/noone returns 'false'", () => {
        return request(app)
        .get("/profiles/noone")
        .expect('false');
    });

    test("Add new recipe", async() => {
        const ingredients = [{"quantity":"2", "units":"No Units", "ingredient":"Eggs"}, {"quantity":"200", "units":"g", "ingredient":"flour"}];
        const directions = ["Preheat an oven to 200C", "Combine the eggs and the flour in a large bowl", "Place in a baking tray and cook for 20 minutes", "Leave to cool for 5 minutes before serving"]
        const body7 = 'date="23 April 2019"&creator="baker213"&title="Test Recipe"&description="A basic recipe for something"&ingredients='+JSON.stringify(ingredients)+'&directions='+JSON.stringify(directions)+'&thumbnail="https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"'
        const body2 = {
            "date":"23 April 2019",
            "creator":"baker213",
            "title":"Test Recipe",
            "description":"A basic recipe for something",
            "ingredients":JSON.stringify(ingredients),
            "directions":JSON.stringify(directions),
            "thumbnail":"https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
        console.log(body2);
        const request2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body2
        }
        console.log(request2);
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        .expect("Recipe successfully added");
    });
});
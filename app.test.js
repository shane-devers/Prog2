'use strict';
const request = require('supertest');
const app = require("./app");
const tokenSignIn = require('./tokenSignIn');
//const image = require('http://clipart-library.com/images/BTaKbqGEc.png')


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

    test("GET /recipes/search/Cheesecake does not return chocolate cake recipe", () => {
        return request(app)
        .get("/recipes/search/Cheesecake")
        .expect(/^((?!Chocolate cake).)*$/);
    });

    test("GET /recipes/name/{username} returns JSON", () => {
        return request(app)
        .get("/recipes/name/user163")
        .expect("Content-type", /json/);
    });

    test('GET /recipes/cake/cheese cannot be found', async() => {
        try{
            await request(app)
            .get('/recipes/cake/cheese');
        } catch (error) {
            expect(error.message).toBe('Not Found');
        }
    })
});

describe('Test userIDName service', () => {
    test("GET /userIDName/115240131475881817498 returns html/text", () => {
        return request(app)
        .get("/userIDName/115240131475881817498")
        .expect("Content-type", /html/);
    });

    test("GET /userIDName/acx (not in userIDName.json) returns false", async() => {
        try {
            await request(app)
            .get("/userIDName/acx")
        } catch(error) {
            expect(error.message).toBe('Not Found');
        }
    });
});

describe('Test profiles service', () => {
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
});

describe('Test new recipe service', () => {
    test("Add new recipe", async() => {
        const ingredients = [{"quantity":"2", "units":"No Units", "ingredient":"Eggs"}, {"quantity":"200", "units":"g", "ingredient":"flour"}];
        const directions = ["Preheat an oven to 200C", "Combine the eggs and the flour in a large bowl", "Place in a baking tray and cook for 20 minutes", "Leave to cool for 5 minutes before serving"]
        const body2 = {
            "idtoken":98981029412803981029480912840,
            "date":"23 April 2019",
            "creator":"baker213",
            "title":"Test Recipe",
            "description":"A basic recipe for something",
            "ingredients":JSON.stringify(ingredients),
            "directions":JSON.stringify(directions),
            "thumbnail":"https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        .expect("Recipe successfully added");
        spy.mockRestore();
    });

    test("Add new recipe fails with invalid ID token", async() => {
        try {
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
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        } catch(error) {
            expect(error.message).toBe('Unauthorized');
        }
    });

    test("Add new recipe fails if at least one property is blank", async() => {
        try {
        const ingredients = [{"quantity":"2", "units":"No Units", "ingredient":"Eggs"}, {"quantity":"200", "units":"g", "ingredient":"flour"}];
        const directions = ["Preheat an oven to 200C", "Combine the eggs and the flour in a large bowl", "Place in a baking tray and cook for 20 minutes", "Leave to cool for 5 minutes before serving"]
        const body2 = {
            "idtoken":12,
            "date":"23 April 2019",
            "creator":"baker213",
            "title":"",
            "description":"A basic recipe for something",
            "ingredients":JSON.stringify(ingredients),
            "directions":JSON.stringify(directions),
            "thumbnail":"https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        spy.mockRestore();
        } catch(error) {
            expect(error.message).toBe('Bad Request');
        }

    });

    test("Add new recipe fails if any of the properties are missing", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        try {
        const ingredients = [{"quantity":"2", "units":"No Units", "ingredient":"Eggs"}, {"quantity":"200", "units":"g", "ingredient":"flour"}];
        const directions = ["Preheat an oven to 200C", "Combine the eggs and the flour in a large bowl", "Place in a baking tray and cook for 20 minutes", "Leave to cool for 5 minutes before serving"]
        const body2 = {
            "idtoken":12,
            "date":"23 April 2019",
            "creator":"baker213",
            "description":"A basic recipe for something",
            "ingredients":JSON.stringify(ingredients),
            "directions":JSON.stringify(directions),
            "thumbnail":"https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
        await request(app)
        .post("/new")
        .type('form')
        .send(body2)
        } catch(error) {
            expect(error.message).toBe('Bad Request');
        }
        spy.mockRestore();
    });
});

describe('Test uploadImage service', () => {
    test('Uploading image succeeds with valid ID token', async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        const body2 = {
            "image":image
        }
        await request(app)
        .post('/uploadImage')
        .type('form')
        .send(body2)
        .expect('Image uploaded!');
    });
});

describe('Test addComment service', () => {
    test("Add new comment", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        const toSend = {
            "idtoken":94593405345,
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
        spy.mockRestore();
    });

    test("Add new comment fails if a property is missing", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        try {
            const toSend = {
                "idtoken":94593405345,
                "date":"24 April 2019",
                "author":"baker213",
                "text":"Great recipe! Thanks for sharing",
                "recipe":0
            }
            await request(app)
            .post('/addComment')
            .type('form')
            .send(toSend)
        } catch(error) {
            expect(error.message).toBe('Bad Request');
        }
        spy.mockRestore();
    });

    test("Add new comment fails if user is not signed in / idtoken is invalid", async() => {
        try {
            const toSend = {
                "idtoken":12312,
                "date":"24 April 2019",
                "author":"baker213",
                "text":"Great recipe! Thanks for sharing",
                "recipe":0
            }
            await request(app)
            .post('/addComment')
            .type('form')
            .send(toSend)
        } catch(error) {
            expect(error.message).toBe('Unauthorized');
        }
    });
});

describe('Test createProfile service', () => {
    test("Create new profile", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        const toSend = {
            "idtoken":9128309128039812093,
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
        spy.mockRestore();
    });

    test("Create new profile without all required data values", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        try{
            const toSend = {
                "idtoken":9128309128039812093,
                "userID":"01285239523234",
                "date":"27 April 2019",
                "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
            }
            await request(app)
            .post('/createProfile')
            .type('form')
            .send(toSend);
        } catch(error) {
            expect(error.message).toBe('Bad Request');
        }
        spy.mockRestore();
    });

    test("Create new profile fails with invalid ID token", async() => {
        try{
            const toSend = {
                "idtoken":921343,
                "userID":"01285239523234",
                "username":"newUser3",
                "date":"27 April 2019",
                "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
            }
            await request(app)
            .post('/createProfile')
            .type('form')
            .send(toSend);
        } catch(error) {
            expect(error.message).toBe('Unauthorized');
        }
    });

    test("Create new profile fails if username used in another profile", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        try{
            const toSend = {
                "idtoken":921823742239857209485204343,
                "userID":"01285239523234",
                "username":"user163",
                "date":"27 April 2019",
                "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
            }
            await request(app)
            .post('/createProfile')
            .type('form')
            .send(toSend);
        } catch(error) {
            expect(error.message).toBe('Conflict');
        }
        spy.mockRestore();
    });

    test("Create new profile fails if a profile is already associated with this Google account", async() => {
        const spy = jest.spyOn(tokenSignIn, 'tokenSignIn');
        spy.mockReturnValue(true);
        try{
            const toSend = {
                "idtoken":921823742239857209485204343,
                "userID":"115240131475881817498",
                "username":"newUser125",
                "date":"27 April 2019",
                "pictureURL":"http://clipart-library.com/images/BTaKbqGEc.png"
            }
            await request(app)
            .post('/createProfile')
            .type('form')
            .send(toSend);
        } catch(error) {
            expect(error.message).toBe('Conflict');
        }
        spy.mockRestore();
    });
});
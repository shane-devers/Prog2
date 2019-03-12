'use strict';

const request = require('supertest');
const app = require("./app");

describe("Test recipes service", () => {
    test("GET /recipes succeeds", () => {
        return request(app)
        .get("/list")
        .expect(200);
    });

    test("GET /recipes returns JSON", () => {
        return request(app)
        .get("/list")
        .expect("Content-type", /json/);
    });

    test("GET /recipes includes chocolate cake", () => {
        return request(app)
        .get("/list")
        .expect(/Chocolate Cake/);
    });
});
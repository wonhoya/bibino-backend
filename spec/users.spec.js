const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const app = require("../app");

const User = require("../models/User");
const Beer = require("../models/Beer");
const leanQueryByOptions = require("../utils/leanQueryByOptions");
const sortBeersByEuclideanDistance = require("../utils/sortBeersByEuclideanDistance");

const userId = "6087d690df5cc79f9ab20261";
const token = jwt.sign(userId, process.env.PRIVATE_KEY);
const fakeToken = "lmaoplznoerroyeserroryayayaya"
let user;
let recommendations;

describe("api/users", function() {
  this.timeout (5000);

  before(async function () {
    user = await leanQueryByOptions(User.findById(userId));
    const beers = await leanQueryByOptions(Beer.find());
    recommendations = sortBeersByEuclideanDistance(user, beers).slice(
      0,
      5
    );
  });

  describe("GET `/api/users/:userId`", () => {
    it("should get user if token is valid", function (done) {
      request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          expect(res.body).to.eql(JSON.parse(JSON.stringify(user)));
          done();
        });
    });

    it("should not get user if token is invalid", function (done) {
      request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${fakeToken}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);

          expect(res.body).to.eql({ error: "Validation Error" });
          done();
        });
    });

    it("should get user recommendations if token is valid", function (done) {
      request(app)
        .get(`/api/users/${userId}/recommendations`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify(recommendations)));
          done();
        });
    });
  });
});

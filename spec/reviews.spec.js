const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const app = require("../app");

const Review = require("../models/Review");

const userId = "6087d52adf5cc79f9ab1123b";
const beerId = "60869bd7080896609959271a";
const token = jwt.sign(userId, process.env.PRIVATE_KEY);
let review;

describe("api/reviews", function() {
  this.timeout (5000);

  before(async function () {
    review = await Review.findOne({user: userId, beer: beerId});
  });

  describe("GET `/api/reviews/:reviewId`", () => {
    it("should get review if token is valid", function (done) {
      request(app)
        .get(`/api/reviews/${review.id}`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify(review)));
          done();
        });
    });
  });

  describe("PUT `/api/reviews/:reviewId`", () => {
    it("should update review if token is valid", function (done) {
      request(app)
      .put(`/api/reviews/${review.id}`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .send({
          beerId: "60869bd7080896609959271a",
          review: {
            rating: 3,
            body: 3,
            aroma: 3,
            sparkling: 3,
          },
          comment: "I AM GROOOT"
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql({
            status: "Submit Success",
            payload: {},
          });
          done();
        });
    });

    it("should fail if review is not valid", function (done) {
      request(app)
      .put(`/api/reviews/${review.id}`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .send({
          beerId: "60869bd7080896609959271a",
          review: {
            rating: 123,
            body: 123,
            aroma: 123,
            sparkling: 123,
          },
          comment: "I AM GROOOTaaaaaaaaaa"
        })
        .expect("Content-Type", /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.throw();
          done();
        });
    });
  });
});

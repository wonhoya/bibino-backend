const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const app = require("../app");

const User = require("../models/User");
const Beer = require("../models/Beer");
const Review = require("../models/Review");
const leanQueryByOptions = require("../utils/leanQueryByOptions");
const sortBeersByEuclideanDistance = require("../utils/sortBeersByEuclideanDistance");
const {fakeBase64, asahiBase64} = require("./base64");

const userId = "6087d52adf5cc79f9ab1123b";
const beerId = "60869bd7080896609959271a";
const token = jwt.sign(userId, process.env.PRIVATE_KEY);
const fakeToken = "lmaoplznoerroyeserroryayayaya"
let beer;
let recommendations;
let comments;
let ranking;

describe("api/beers", function() {
  this.timeout (5000);

  before(async function () {
    beer = await leanQueryByOptions(Beer.findById(beerId));
    const beers = await leanQueryByOptions(Beer.find());
    const baseBeerIndex = beers.findIndex(
      (beer) => beer._id.toString() === beerId
    );
    recommendations = sortBeersByEuclideanDistance(beers[baseBeerIndex], beers).slice(
      1,
      6
    );
    comments = await Review.getComments(beerId, false)
      .sort("createdAt")
      .lean();
    ranking = await leanQueryByOptions(Beer.find());
    ranking.sort((a, b) => {
      let difference = b.averageRating - a.averageRating;

      if (difference === 0) {
        difference = b.reviewCounts - a.reviewCounts;
      }

      return difference;
    });
  });

  describe("GET `/api/beers/:beerId`", () => {
    it("should get beer if token is valid", function (done) {
      request(app)
        .get(`/api/beers/${beerId}`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify(beer)));
          done();
        });
    });

    it("should not get beer if token is invalid", function (done) {
      request(app)
        .get(`/api/beers/${beerId}`)
        .set("Authorization", `Bearer ${fakeToken}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql({ error: "Validation Error" });
          done();
        });
    });

    it("should get beer recommendations if token is valid", function (done) {
      request(app)
        .get(`/api/beers/${beerId}/recommendations`)
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

    it("should get beer comments if token is valid", function (done) {
      request(app)
        .get(`/api/beers/${beerId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify(comments)));
          done();
        });
    });
  });

  describe("GET `/api/beers/rankings`", () => {
    it("should get beer ranking with query(limit) if token is valid", function (done) {
      request(app)
        .get("/api/beers/rankings")
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .query({limit: 5})
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify(ranking.slice(0, 5))));
          done();
        });
    });
  });

  describe("GET `/api/beers/search`", () => {
    it("should search beers with query(text) if token is valid", function (done) {
      request(app)
        .get("/api/beers/search")
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .query({text: "hi"})
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql([
            {
              _id: '60869bd70808966099592719',
              reviewCounts: 1,
              name: 'Hite',
              description: 'The No. 1 selling KOREAN Beer Brewed & bottled in Korea at HITE Brewery co. ltd. Seoul. Brewed form Purest underground well water, Canadian Harrington barley, Parle Aroma and Yakima hops, yeast and no additives or preservative.',
              imagePath: 'https://bibino.s3.ap-northeast-2.amazonaws.com/beers/60869bd70808966099592719.jpg',
              __v: 0
            },
            {
              _id: '60869bd7080896609959271d',
              reviewCounts: 1,
              name: 'Asahi Super Dry',
              description: 'Japaness beer clear taste',
              imagePath: 'https://bibino.s3.ap-northeast-2.amazonaws.com/beers/60869bd7080896609959271d.jpg',
              __v: 0
            },
            {
              _id: '60869bd70808966099592726',
              reviewCounts: 0,
              name: 'Kirin',
              description: 'Bottle, can and keg: Filtered. Brewed under license in various locations around the world (UK, USA, Germany, etc) to differing recipes and abv. Finest barley malt, premium hops, smooth finish, no bitter aftertaste.',
              imagePath: 'https://bibino.s3.ap-northeast-2.amazonaws.com/beers/60869bd70808966099592726.jpg',
              __v: 0
            },
            {
              _id: '60869bd70808966099592723',
              reviewCounts: 2,
              name: 'Heineken',
              description: '100% Barley malt, choice hops and pure water give this brew unsurpassed clarity.',
              imagePath: 'https://bibino.s3.ap-northeast-2.amazonaws.com/beers/60869bd70808966099592723.jpg',
              __v: 0
            },
            {
              _id: '60869bd7080896609959271b',
              reviewCounts: 2,
              name: 'Hoegaarden',
              description: 'Unfiltered Belgian White, flavored with coriander and orange peel, creating a sweet & sour taste.',
              imagePath: 'https://bibino.s3.ap-northeast-2.amazonaws.com/beers/60869bd7080896609959271b.jpg',
              __v: 0
            }
          ]);
          done();
        });
    });
  });

  describe("POST `/api/beers/scan`", () => {
    it("should find beer if scanned beer exists in db", function (done) {
      request(app)
        .post("/api/beers/scan")
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .send({
          base64: asahiBase64
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.eql(JSON.parse(JSON.stringify({
            status: "Analyze Success",
            payload: "60869bd7080896609959271d"
          })));
          done();
        });
    });

    xit("should fail if it is not base64 string", function (done) {
      request(app)
        .post("/api/beers/scan")
        .set("Authorization", `Bearer ${token}`)
        .type("application/json")
        .send({
          base64: fakeBase64
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

const createError = require("http-errors");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");
const getEuclideanDistance = require("../../../utils/getEuclideanDistance");
const callGoogleVisionAsync = require("../../../util/callGoogleVisionAsync");

const searchBeer = async (req, res, next) => {
  try {
    //프론트엔드 보고 마저 짤 예정
    const beers = await Beer.find();

    res.json(beers);
  } catch (err) {
    next(createError(500, err));
  }
};

const getBeer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beer = await Beer.findById(id).lean({
      virtuals: [
        "averageRating",
        "averageBody",
        "averageAroma",
        "averageSparkling",
      ],
    });

    res.json(beer);
  } catch (err) {
    next(createError(500, err));
  }
};

const scanPhoto = async (req, res, next) => {
  try {
    const detectedBeerText = await callGoogleVisionAsync(req.body.base64);

    if (!detectedBeerText.length) {
      return res.json({
        status: "Analyze Failure",
        payload: {},
      });
    }

    const detectedBeerTexts = detectedBeerText.split("\n");
    const flatBeerTexts = detectedBeerTexts.map((string) =>
      string.toLowerCase().replace(/\s+/g, "")
    );

    const findBeerInfo = (textsInImage, beerList) => {
      for (const text of textsInImage) {
        for (const beer of beerList) {
          if (beer.name.toLowerCase().replace(/\s+/g, "") === text) {
            return beer._id;
          }
        }
      }
    };

    const beersInDatabase = await Beer.find().select("name");
    const matchBeerId = findBeerInfo(flatBeerTexts, beersInDatabase);

    const beerInfo = await Beer.findById(matchBeerId);

    res.json({
      status: beerInfo ? "Analyze Success" : "Analyze Failure",
      payload: beerInfo,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getBeerComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Review.getComments(id, false)
      .sort("writtenDate")
      .lean();

    res.json(comments);
  } catch (err) {
    next(createError(500, err));
  }
};

const getBeerRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beers = await Beer.find().lean({
      virtuals: [
        "averageRating",
        "averageBody",
        "averageAroma",
        "averageSparkling",
      ],
    });
    const baseBeerIndex = beers.findIndex((beer) => beer._id.toString() === id);

    beers.forEach((beer) => {
      beer.distance = getEuclideanDistance(
        beers[baseBeerIndex].averageBody,
        beers[baseBeerIndex].averageAroma,
        beers[baseBeerIndex].averageSparkling,
        beer.averageBody,
        beer.averageAroma,
        beer.averageSparkling
      );
    });

    res.json(beers.slice(1, 6));
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports = {
  searchBeer,
  getBeer,
  getBeerComments,
  getBeerRecommendations,
  scanPhoto,
};

const createError = require("http-errors");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const sortBeersByEuclideanDistance = require("../../../utils/sortBeersByEuclideanDistance");
const callGoogleVisionAsync = require("../../../utils/callGoogleVisionAsync");
const leanQueryByOptions = require("../../../utils/leanQueryByOptions");

const searchBeer = async (req, res, next) => {
  try {
    const searchText = req.get("search-text");
    const lowerCaseSearchText = searchText.toLowerCase();
    const beers = await Beer.find().lean();
    const searchedBeers = beers.filter(({ name }) =>
      name.toLowerCase().includes(lowerCaseSearchText)
    );

    res.json(searchedBeers);
  } catch (err) {
    next(createError(500, err));
  }
};

const getBeer = async (req, res, next) => {
  try {
    console.log("req.params", req.params);
    const { beerId } = req.params;
    const beer = await leanQueryByOptions(Beer.findById(beerId));

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

    console.log("detectedBeerTexts", detectedBeerTexts);

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
  } catch (err) {
    next(createError(500, err));
  }
};

const getBeerComments = async (req, res, next) => {
  try {
    const { beerId } = req.params;
    const comments = await Review.getComments(beerId, false)
      .sort("createdAt")
      .lean();

    res.json(comments);
  } catch (err) {
    next(createError(500, err));
  }
};

const getBeerRecommendations = async (req, res, next) => {
  try {
    const { beerId } = req.params;
    const beers = await leanQueryByOptions(Beer.find());
    const baseBeerIndex = beers.findIndex(
      (beer) => beer._id.toString() === beerId
    );
    const recommendations = sortBeersByEuclideanDistance(
      beers[baseBeerIndex],
      beers
    ).slice(1, 6);

    res.json(recommendations);
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

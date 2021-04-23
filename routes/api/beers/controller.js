const createError = require("http-errors");
const callGoogleVisionAsync = require("../../../util/callGoogleVisionAsync");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const getBeers = async (req, res, next) => {
  try {
    const beers = await Beer.find();

    res.json(beers);
  } catch (err) {
    next(createError(500, "Internal Server Error"));
  }
};

const getBeer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beer = await Beer.findById(id).lean();

    res.json(beer);
  } catch (err) {
    next(createError(500, err));
  }
};

const scanPhoto = async (req, res, next) => {
  try {
    console.log(req.body.message);

    const detectedBeerText = await callGoogleVisionAsync(req.body.base64);
    const detectedBeerTexts = detectedBeerText.split("\n");
    const flatBeerTexts = detectedBeerTexts.map((string) =>
      string.toLowerCase().replace(/\s+/g, "")
    );

    console.log("flatBeerTexts:", flatBeerTexts);

    // const flatBeerTexts = ["ef", "ef", "egeh", "obgoldenlager"];

    const beersInDb = await Beer.find().select("name");
    console.log("beersInDb", beersInDb);

    const findBeerInfo = (textsInImage, beerList) => {
      for (const text of textsInImage) {
        for (const beerName of beerList) {
          if (beerName.name.toLowerCase().replace(/\s+/g, "") === text) {
            return beerName._id;
          }
        }
      }
    };

    const matchBeerId = findBeerInfo(flatBeerTexts, beersInDb);
    console.log("id is", matchBeerId);

    const beerInfo = await Beer.findById(matchBeerId);
    console.log(beerInfo);

    res.json({ beerInfo });
  } catch (error) {
    console.log(error);
  }
};

const getBeerStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await Review.getStats(id, false);

    res.json(stats);
  } catch (err) {
    next(createError(500, "Internal Server Error"));
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
    next(createError(500, "Internal Server Error"));
  }
};

module.exports = {
  getBeers,
  getBeer,
  getBeerStats,
  getBeerComments,
  scanPhoto,
};

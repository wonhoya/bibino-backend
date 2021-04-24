const createError = require("http-errors");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const {
  BUCKET,
  USER_BEERS,
  BEERS,
  ACL,
  CONTENT_ENCODING,
} = require("../../../constants/awsParams");
const base64 = require("./mock");
const buffer = new Buffer.from(base64, "base64");

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
    const { id } = req.params;
    const beer = await leanQueryByOptions(Beer.findById(id));

    res.json(beer);
  } catch (err) {
    next(createError(500, err));
  }
};

const scanPhoto = async (req, res, next) => {
  try {
    const { email } = res.locals.user;
    const detectedBeerText = await callGoogleVisionAsync(base64);

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

    const beersInDatabase = await Beer.find();
    const matchBeerId = findBeerInfo(flatBeerTexts, beersInDatabase);
    const beerInfo = await Beer.findById(matchBeerId);

    if (beerInfo) {
      const params = {
        Bucket: `${BUCKET}/${USER_BEERS}/${email}`,
        Key: new Date().toISOString(),
        Body: buffer,
        ACL,
        ContentEncoding: CONTENT_ENCODING,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          throw new Error("s3 upload failed");
        }

        if (data) {
          res.json("Successfully upload files!");
        }
      });
    }

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
    const beers = await leanQueryByOptions(Beer.find());
    const baseBeerIndex = beers.findIndex((beer) => beer._id.toString() === id);
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

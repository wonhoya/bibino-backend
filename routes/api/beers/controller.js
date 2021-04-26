const createError = require("http-errors");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const {
  BUCKET,
  ACL,
  CONTENT_ENCODING,
  CONTENT_TYPE,
} = require("../../../constants/awsParams");

const User = require("../../../models/User");
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
    const { beerId } = req.params;
    const beer = await leanQueryByOptions(Beer.findById(beerId));

    res.json(beer);
  } catch (err) {
    next(createError(500, err));
  }
};

const scanPhoto = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    const buffer = new Buffer.from(req.body.base64, "base64");
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
          if (beer.name.toLowerCase().replace(/\s+/g, "").includes(text)) {
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
        Bucket: `${BUCKET}`,
        Key: `${id}/${new Date().toISOString()}`,
        Body: buffer,
        ACL,
        ContentEncoding: CONTENT_ENCODING,
        ContentType: CONTENT_TYPE,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          throw new Error("s3 upload failed");
        }

        try {
          await User.findByIdAndUpdate(
            id,
            {
              $push: {
                beers: {
                  beer: beerInfo._id,
                  myBeerImageURL: data.Location,
                },
              },
            },
            { runValidators: true }
          );
        } catch (err) {
          next(createError(500, err));
        }
      });
    }

    res.json({
      status: beerInfo ? "Analyze Success" : "Analyze Failure",
      payload: beerInfo?._id,
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

const createError = require("http-errors");
const callGoogleVisionAsync = require("../../../util/callGoogleVisionAsync");

const Beer = require("../../../models/Beer");

const getBeer = async (req, res, next) => {
  try {
    const beer = await Beer.create();
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

module.exports = { getBeer, scanPhoto };

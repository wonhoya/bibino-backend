const createError = require("http-errors");
const callGoogleVisionAsync = require("../../../util/callGoogleVisionAsync");

const Beer = require("../../../models/Beer");
const mockData = require("../../../models/mockDatabase.json");

const getBeer = async (req, res, next) => {
  try {
    const beer = await Beer.create();
    res.json(beer);
  } catch (err) {
    next(createError(err));
  }
};

const scanPhoto = async (req, res, next) => {
  try {
    // console.log(req.body.message);

    // const detectedBeerText = await callGoogleVisionAsync(req.body.base64);
    // const detectedBeerTexts = parsedImage.split("\n");
    // const flatBeerTexts = parsedStrings.map((string) =>
    //   string.toLowerCase().replace(/\s+/g, "")
    // );

    const flatBeerTexts = ["ef", "ef", "egeh", "obgoldenlager"];
    const beersInDb = await Beer.find().select("name");
    console.log("beers", beersInDb);

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

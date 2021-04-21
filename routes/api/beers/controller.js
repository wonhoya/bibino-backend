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
    console.log(req.body.message);

    const parsedImage = await callGoogleVisionAsync(req.body.base64);
    const parsedStrings = parsedImage.split("\n");
    const flatParsedStrings = parsedStrings.map((string) =>
      string.toLowerCase().replace(/\s+/g, "")
    );

    // const flatParsedStrings = parsedStrings.toLowerCase();
    console.log("splitted", parsedStrings);
    console.log("flatted", flatParsedStrings);

    res.json({ message: "connection established" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getBeer, scanPhoto };

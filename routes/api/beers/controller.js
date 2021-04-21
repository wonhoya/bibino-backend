const createError = require("http-errors");
const callGoogleVisionAsync = require("../../../util/callGoogleVisionAsync");

const Beer = require("../../../models/Beer");

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
    const result = await callGoogleVisionAsync(req.body.base64);

    console.log("vision result is", result);

    res.json({ message: "connection established" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getBeer, scanPhoto };

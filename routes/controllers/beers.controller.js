const createError = require("http-errors");

const Beer = require("../../models/Beer");

const getBeer = async (req, res, next) => {
  try {
    const beer = await Beer.create();
    res.json(beer);
  } catch (err) {
    next(createError(err));
  }
};

exports.getBeer = getBeer;

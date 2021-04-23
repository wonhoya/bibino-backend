const createError = require("http-errors");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const searchBeer = async (req, res, next) => {
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
    next(createError(500, "Internal Server Error"));
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
  searchBeer,
  getBeer,
  getBeerStats,
  getBeerComments,
};

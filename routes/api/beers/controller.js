const createError = require("http-errors");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const getBeer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beer = await Beer.findById(id).lean();

    res.json(beer);
  } catch (err) {
    next(createError(err));
  }
};

const getBeerStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await Review.getStats(id, false);

    res.json(stats);
  } catch (err) {
    next(createError(err));
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
    next(createError(err));
  }
};

// const getRecommendationsToUser = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(createError(err));
//   }
// };

// const getRecommendationsByBeer = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(createError(err));
//   }
// };

module.exports = {
  getBeer,
  getBeerStats,
  getBeerComments,
  // getRecommendationsToUser,
  // getRecommendationsByBeer,
};

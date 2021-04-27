const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../../../models/User");
const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const createReview = async (req, res, next) => {
  const userId = res.locals.user.id;

  const {
    beerId,
    review: { rating, body, aroma, sparkling },
    comment,
  } = req.body;

  try {
    const review = await Review.findOne({
      user: userId,
      beer: beerId,
    });

    if (review) {
      return next(createError(421, "Review Already Exist"));
    }
  } catch (err) {
    next(createError(500, err));
  }

  const session = await mongoose.startSession();
  const promises = [];

  try {
    session.startTransaction();
    promises.push(
      Review.create(
        [
          {
            user: userId,
            beer: beerId,
            createdAt: new Date().toISOString(),
            comment,
            rating,
            body,
            aroma,
            sparkling,
          },
        ],
        { session }
      )
    );
    promises.push(
      User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            reviewCounts: 1,
            totalRating: rating,
            totalBody: body,
            totalAroma: aroma,
            totalSparkling: sparkling,
          },
        },
        { runValidators: true, session }
      )
    );
    promises.push(
      Beer.findByIdAndUpdate(
        beerId,
        {
          $inc: {
            reviewCounts: 1,
            totalRating: rating,
            totalBody: body,
            totalAroma: aroma,
            totalSparkling: sparkling,
          },
        },
        { runValidators: true, session }
      )
    );

    await Promise.all(promises);
    await session.commitTransaction();
    session.endSession();
    return res.json({
      status: "Submit Success",
      payload: {},
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(createError(500, err));
  }
};

const getReview = async (req, res, next) => {
  try {
    let { reviewId } = req.params;
    reviewId = mongoose.Types.ObjectId(reviewId);
    const review = await Review.findById(reviewId).lean();

    return res.json(review);
  } catch (err) {
    next(createError(500, err));
  }
};

const updateReview = async (req, res, next) => {
  let { reviewId } = req.params;
  reviewId = mongoose.Types.ObjectId(reviewId);
  const userId = res.locals.user.id;

  const {
    beerId,
    review: { rating, body, aroma, sparkling },
    comment,
  } = req.body;

  const session = await mongoose.startSession();
  const promises = [];

  try {
    session.startTransaction();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { beer: beerId, user: userId, rating, body, aroma, sparkling, comment },
      {
        lean: true,
        runValidators: true,
        session,
      }
    );
    promises.push(
      User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            totalRating: rating - review.rating,
            totalBody: body - review.body,
            totalAroma: aroma - review.aroma,
            totalSparkling: sparkling - review.sparkling,
          },
        },
        { runValidators: true, session }
      )
    );
    promises.push(
      Beer.findByIdAndUpdate(
        beerId,
        {
          $inc: {
            totalRating: rating - review.rating,
            totalBody: body - review.body,
            totalAroma: aroma - review.aroma,
            totalSparkling: sparkling - review.sparkling,
          },
        },
        { runValidators: true, session }
      )
    );

    await Promise.all(promises);
    await session.commitTransaction();
    session.endSession();
    return res.json({
      status: "Submit Success",
      payload: {},
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(createError(500, err));
  }
};

module.exports = {
  createReview,
  getReview,
  updateReview,
};

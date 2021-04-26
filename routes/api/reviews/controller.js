const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../../../models/User");
const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const createReview = async (req, res, next) => {
  /**
   * 리뷰 플로우
   * 1. 클라에서 데이터를 보낸다.
   * 2. 받아서 리뷰, 비어, 유저를 다 업데이트해준다. (트랜잭션)
   * 3.
   */

  // const userId = res.locals.user._id;
  // let { beerId } = req.params;
  // beerId = mongoose.Types.ObjectId(beerId);

  const {
    review: { rating, body, aroma, sparkling },
    comment,
  } = req.body;

  //mockData
  const userId = mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d");
  const beerId = mongoose.Types.ObjectId("60801ed238f2c931eaf6a25b");

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
    // const userId = res.locals.user._id;
    // let { beerId } = req.params;
    // beerId = mongoose.Types.ObjectId(beerId);

    //mockData
    const userId = mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d");
    const beerId = mongoose.Types.ObjectId("60801ed238f2c931eaf6a25b");

    const review = await Review.findOne({ user: userId, beer: beerId }).lean();

    return res.json(review);
  } catch (err) {
    next(createError(500, err));
  }
};

const updateReview = async (req, res, next) => {
  // const userId = res.locals.user._id;
  // let { beerId } = req.params;
  // beerId = mongoose.Types.ObjectId(beerId);

  const {
    review: { rating, body, aroma, sparkling },
    comment,
  } = req.body;

  //mockData
  const userId = mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d");
  const beerId = mongoose.Types.ObjectId("60801ed238f2c931eaf6a25b");

  const session = await mongoose.startSession();
  const promises = [];

  try {
    session.startTransaction();

    const review = await Review.findOneAndUpdate(
      { user: userId, beer: beerId },
      { rating, body, aroma, sparkling, comment },
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
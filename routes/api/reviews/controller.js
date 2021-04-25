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

  //밥먹고 와서 할거: 트랜잭션으로 모두 업뎃 or 모두 페일
  const {
    beerId,
    review: { rating, body, aroma, sparkling },
    comment,
  } = req.body;

  try {
    const review = await Review.findOne({
      user: mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d"),
      beer: mongoose.Types.ObjectId("60801ed238f2c931eaf6a259"), //beerId
    });

    if (review) {
      next(createError(421, "Misdirected Request"));
    }
  } catch (err) {
    next(createError(500, err));
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Review.create(
      [
        {
          user: mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d"),
          /** 이거 local에 oid 박아서 할지 아니면 find해서 거기서 oid 가져올지 세팅해야됨 */
          beer: mongoose.Types.ObjectId("60801ed238f2c931eaf6a259"),
          /**beer 진짜 데이터 들올땐 이미 oid임  beerId*/
          writtenDate: new Date().toISOString(),
          comment,
          rating,
          body,
          aroma,
          sparkling,
        },
      ],
      { session }
    );
    //id 나중에 res.locals.user로 바껴야댐
    await User.findByIdAndUpdate(
      mongoose.Types.ObjectId("60841704df5cc79f9a3f7a4d"),
      {
        $inc: {
          reviewCounts: 1,
          totalRating: rating,
          totalBody: body,
          totalAroma: aroma,
          totalSparkling: sparkling,
        },
      },
      { new: true, session }
    );
    await Beer.findByIdAndUpdate(
      mongoose.Types.ObjectId("60801ed238f2c931eaf6a259"),
      {
        $inc: {
          reviewCounts: 1,
          totalRating: "AAAAA",
          totalBody: body,
          totalAroma: aroma,
          totalSparkling: sparkling,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    next(createError(500, err));
  }
};

module.exports = {
  createReview,
};

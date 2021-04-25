const createError = require("http-errors");

const Beer = require("../../../models/Beer");
const Review = require("../../../models/Review");

const createReview = async (req, res, next) => {
  try {
    /**
     * 리뷰 플로우
     * 1. 클라에서 데이터를 보낸다.
     * 2. 받아서 리뷰, 비어, 유저를 다 업데이트해준다. (트랜잭션)
     * 3.
     */
    const {
      beer,
      review: { rating, body, aroma, sparkling },
      comment,
    } = req.body;
    await Review.create({
      beer,
      writtenDate: new Date().toISOString(),
      comment,
      rating,
      body,
      aroma,
      sparkling,
    });

    res.json();
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports = {
  createReview,
};

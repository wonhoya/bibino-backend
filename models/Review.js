const mongoose = require("mongoose");
const validator = require("validator");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the user mongoId"],
    validate: [validator.isMongoId, "Please provide a valid user mongoId"],
  },
  beer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beer",
    required: [true, "Please provide the beer mongoId"],
    validate: [validator.isMongoId, "Please provide a valid beer mongoId"],
  },
  writtenDate: {
    type: Date,
    required: [true, "Please provide the written date"],
    validate: [validator.isDate, "Please provide a valid written date"],
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    default: 3,
    min: [0.5, "Rating must be greater than or equal to 0.5"],
    max: [5, "Rating must be smaller than or equal to 5.0"],
    required: [true, "Please provide the rating"],
  },
  body: {
    type: Number,
    default: 5,
    min: [0, "Rating must be greater than or equal to 0"],
    max: [10, "Rating must be smaller than or equal to 10"],
    required: [true, "Please provide the body"],
  },
  aroma: {
    type: Number,
    default: 5,
    min: [0, "Rating must be greater than or equal to 0"],
    max: [10, "Rating must be smaller than or equal to 10"],
    required: [true, "Please provide the aroma"],
  },
  sparkling: {
    type: Number,
    default: 5,
    min: [0, "Rating must be greater than or equal to 0"],
    max: [10, "Rating must be smaller than or equal to 10"],
    required: [true, "Please provide the sparkling"],
  },
});

reviewSchema.statics.getStats = function (id, isUser) {
  try {
    const match = isUser
      ? { user: mongoose.Types.ObjectId(id) }
      : { beer: mongoose.Types.ObjectId(id) };
    const stats = Review.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          averageBody: { $avg: "$body" },
          averageAroma: { $avg: "$aroma" },
          averageSparkling: { $avg: "$sparkling" },
        },
      },
    ]);

    return stats;
  } catch (err) {
    return err;
  }
};

reviewSchema.statics.getComments = function (id, isUser) {
  try {
    const match = isUser
      ? { user: mongoose.Types.ObjectId(id) }
      : { beer: mongoose.Types.ObjectId(id) };
    const comments = Review.find(match)
      .select("user comment rating")
      .populate("user", "name imagePath");

    return comments;
  } catch (err) {
    return err;
  }
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

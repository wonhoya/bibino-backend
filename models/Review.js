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
    min: [0.5, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  body: {
    type: Number,
    required: [true, "Please provide the body"],
  },
  aroma: {
    type: Number,
    required: [true, "Please provide the aroma"],
  },
  sparkling: {
    type: Number,
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
    const match = isUser ? { user: id } : { beer: id };
    const comments = Review.find(match)
      .select("user comment rating")
      .populate("user", "name imagePath");

    return comments;
  } catch (err) {
    return err;
  }
};

reviewSchema.statics.getRecommendations = async function (id, isUser) {
  try {
    const match = isUser ? { user: id } : { beer: id };
    const recommendations = await Review;
    return recommendations;
  } catch (err) {
    return err;
  }
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

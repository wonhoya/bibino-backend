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
    required: [true, "Please provide the rating"],
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

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

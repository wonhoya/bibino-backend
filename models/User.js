const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    validate: [validator.isAlpha, "Please provide a valid name"],
    maxlength: 15,
    minlength: 2,
  },
  imagePath: {
    type: String,
    validate: [validator.isURL, "Please provide a valid url"],
  },
  beers: [
    {
      beer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer",
        required: [true, "Please provide the beer mongoId"],
        validate: [validator.isMongoId, "Please provide a valid beer mongoId"],
      },
      myBeerImageURL: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"],
      },
    },
  ],
  reviewCounts: {
    type: Number,
    default: 0,
    min: [0, "review counts should me bigger than 0"],
    validate: [validator.isInt, "Please provide a valid review counts"],
  },
  totalRating: {
    type: Number,
    default: 0,
    min: [0, "review counts should me bigger than 0"],
    validate: [validator.isNumeric, "Please provide a valid total rating"],
  },
  totalBody: {
    type: Number,
    default: 0,
    min: [0, "review counts should me bigger than 0"],
    validate: [validator.isNumeric, "Please provide a valid total body"],
  },
  totalAroma: {
    type: Number,
    default: 0,
    min: [0, "review counts should me bigger than 0"],
    validate: [validator.isNumeric, "Please provide a valid total aroma"],
  },
  totalSparkling: {
    type: Number,
    default: 0,
    min: [0, "review counts should me bigger than 0"],
    validate: [validator.isNumeric, "Please provide a valid total sparkling"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

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
    required: [true, "Please provide your url"],
    validate: [validator.isURL, "Please provide a valid url"],
    type: String,
  },
  beers: [
    {
      detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer",
      },
      myBeerImageURL: {
        type: String,
        validate: [validator.isURL, "Please provide a valid url"],
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;

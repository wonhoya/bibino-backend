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
    //auth에서 어떤 식으로 던져주는지 확인한 후 validate 넣어야됨
    type: String,
  },
  beers: [
    {
      detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beer",
      },
      localImagePath: {
        type: mongoose.Schema.Types.String,
        validate: [
          validator.isDataURI,
          "Please provide a valid local image path",
        ],
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;

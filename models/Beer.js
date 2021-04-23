const mongoose = require("mongoose");
const validator = require("validator");

const beerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us beer name!"],
    validate: [validator.isAlphanumeric, "Please provide a valid name"],
    maxlength: 20,
    minlength: 2,
  },
  imagePath: {
    //s3 url
    type: String,
  },
  description: {
    type: String,
    required: [true, "Please tell us beer description!"],
  },
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;

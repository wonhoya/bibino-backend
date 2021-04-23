const mongoose = require("mongoose");
const validator = require("validator");

const beerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us beer name!"],
      validate: [validator.isAlphanumeric, "Please provide a valid name"],
    },
    imagePath: {
      type: String,
      required: [true, "Please provide your url"],
      validate: [validator.isURL, "Please provide a valid url"],
    },
    description: {
      type: String,
      required: [true, "Please tell us beer description!"],
    },
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
    recentComments: [
      {
        userName: {
          type: String,
          validate: [validator.isAlpha, "Please provide a valid user name"],
        },
        userImagePath: {
          type: String,
          validate: [validator.isURL, "Please provide a valid url"],
        },
        comment: {
          type: String,
        },
        rating: {
          type: Number,
          validate: [validator.isNumeric, "Please provide a valid rating"],
        },
        writtenDate: {
          type: Date,
          validate: [validator.isDate, "Please provide a valid written date"],
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

beerSchema.virtual("averageRating").get(function () {
  return this.totalRating / this.reviewCounts;
});

beerSchema.virtual("averageBody").get(function () {
  return this.totalBody / this.reviewCounts;
});

beerSchema.virtual("averageAroma").get(function () {
  return this.totalAroma / this.reviewCounts;
});

beerSchema.virtual("averageSparkling").get(function () {
  return this.totalSparkling / this.reviewCounts;
});

beerSchema.post(/^find/, function (docs, next) {
  if (!docs) {
    return next();
  }

  if (!Array.isArray(docs)) {
    docs = docs.select(
      "-reviewCounts -totalRating -totalBody -totalAroma - totalSparkling"
    );
    return next();
  }

  docs = docs.map((doc) => {
    return doc.select(
      "-reviewCounts -totalRating -totalBody -totalAroma - totalSparkling"
    );
  });
  return next();
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;

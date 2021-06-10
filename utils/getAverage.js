const createError = require("http-errors");

const getAverage = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw createError(500, "Type Error");
  }

  if (b === 0) {
    return b;
  }

  return a / b;
};

module.exports = getAverage;

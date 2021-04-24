const leanQueryByOptions = (
  query,
  options = {
    virtuals: [
      "averageRating",
      "averageBody",
      "averageAroma",
      "averageSparkling",
    ],
  }
) => {
  return query.lean(options);
};

module.exports = leanQueryByOptions;

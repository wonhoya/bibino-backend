/**
 * construct class to manage query
 * @param {Query} query - query from mongoDB
 * @param {Object} queryString - query from URI
 * @returns {Query} return query
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (!this.query) {
      return this;
    }

    let sortBy = "expirationDate";

    if (this.queryString.sort) {
      sortBy = this.queryString.sort.split(",").join(" ");
    }

    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (!this.query) {
      return this;
    }

    let fields = "-__v";

    if (this.queryString.fields) {
      fields = this.queryString.fields.split(",").join(" ");
    }

    this.query = this.query.select(fields);
    return this;
  }

  paginate() {
    if (!this.query) {
      return this;
    }

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  populate() {
    if (!this.query) {
      return this;
    }

    let docs = "author";
    let options = "nickname email";
    let docsObject = {
      path: "options.voters",
    };

    if (this.queryString.docs && this.queryString.options) {
      docs = this.queryString.docs.split(",").join(" ");
      options = this.queryString.options.split(",").join(" ");
    }

    this.query = this.query.populate(docs, options);
    this.query = this.query.populate(docsObject);
    return this;
  }
}

module.exports = APIFeatures;

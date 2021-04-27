const Joi = require("joi");
/**
 * validate inputs by joi schema
 * @param {object} data - object
 * @returns {[object|object]} [error, value] if data doesn't match to schem error has value
 */
const validateReview = (data) => {
  const schema = Joi.object()
    .keys({
      review: Joi.object()
        .keys({
          rating: Joi.number().min(0).max(5).positive().required(),
          body: Joi.number().min(0).max(10).positive().required(),
          aroma: Joi.number().min(0).max(10).positive().required(),
          sparkling: Joi.number().min(0).max(10).positive().required(),
        })
        .and("rating", "body", "aroma", "sparkling")
        .length(4),
      comment: Joi.string().allow("").max(20).required(),
    })
    .and("review", "comment")
    .length(2);

  return schema.validate(data);
};

const validateQuery = (query) => {
  const schema = Joi.object().keys({
    text: Joi.string().allow("").trim().max(50).truncate(),
  });

  return schema.validate(query);
};

const validateBase64 = (base64) => {
  const schema = Joi.string().base64().required();
  return schema.validate(base64);
};

module.exports = {
  validateReview,
  validateQuery,
  validateBase64,
};
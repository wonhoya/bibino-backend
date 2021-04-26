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

  return schema.validate(data, { abortEarly: false });
};

const validateQuery = (query) => {
  const schema = Joi.object().keys({
    text: Joi.string(),
  });

  return schema.validate(query);
};

const validateSearch = (data) => {
  const schema = Joi.object().keys({
    comment: Joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = { validateReview, validateQuery, validateSearch };

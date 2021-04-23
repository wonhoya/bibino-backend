const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const getIdToken = require("../utils/getIdToken");

const authorizeUser = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = getIdToken(authorization);

    const userId = jwt.verify(idToken, process.env.PRIVATE_KEY);

    res.locals.userId = userId;
    next();
  } else {
    next(createError(401, new Error("Unauthorized ID token")));
  }
};

module.exports = authorizeUser;

const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const getIdToken = require("../utils/getIdToken");
const { bibinoPrivateKey } = require("../config");

const authorizeUser = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = getIdToken(authorization);
    const userId = jwt.verify(idToken, bibinoPrivateKey);
    res.locals.userId = userId;
    next();
  } else {
    next(createError(401, new Error("Unauthorized ID token")));
  }
};

module.exports = authorizeUser;

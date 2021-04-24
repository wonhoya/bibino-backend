const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../../../models/User");

const getEuclideanDistance = require("../../../utils/getEuclideanDistance");
const getidToken = require("../../../utils/getIdToken");
const leanQueryByOptions = require("../../../utils/leanQueryByOptions");
const authenticateUser = require("../../../config/auth");
const { bibinoPrivateKey } = require("../../../config");

const signInUser = async (req, res, next) => {
  const authorization = req.get("authorization");
  let userName, userEmail, userProfileImagePath;

  if (authorization?.startsWith("Bearer ")) {
    try {
      const idTokenByGoogle = getidToken(authorization);
      const userData = await authenticateUser(idTokenByGoogle);
      userName = userData.name;
      userEmail = userData.email;
      userProfileImagePath = userData.picture;
    } catch (err) {
      return next(createError(401, err));
    }

    try {
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { name: userName, imagePath: userProfileImagePath },
        { upsert: true, lean: true, new: true }
      );

      const idTokenByBibino = jwt.sign(user._id.toString(), bibinoPrivateKey);

      res.json({ user, idTokenByBibino });
    } catch (err) {
      next(createError(500, err));
    }
  } else {
    next(createError(401));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await leanQueryByOptions(User.findById(id));

    res.json(user);
  } catch (err) {
    next(createError(500, err));
  }
};

const getUserRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const beers = await leanQueryByOptions(User.find());
    const baseBeerIndex = beers.findIndex((beer) => beer._id.toString() === id);

    beers.forEach((beer) => {
      beer.distance = getEuclideanDistance(
        beers[baseBeerIndex].averageBody,
        beers[baseBeerIndex].averageAroma,
        beers[baseBeerIndex].averageSparkling,
        beer.averageBody,
        beer.averageAroma,
        beer.averageSparkling
      );
    });

    const recommendations = beers
      .sort((a, b) => a.distance - b.distance)
      .slice(1, 6);
    res.json(recommendations);
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports = { signInUser, getUser, getUserRecommendations };

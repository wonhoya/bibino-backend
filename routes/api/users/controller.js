const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../../../models/User");
const Beer = require("../../../models/Beer");

const sortBeersByEuclideanDistance = require("../../../utils/sortBeersByEuclideanDistance");
const getidToken = require("../../../utils/getIdToken");
const leanQueryByOptions = require("../../../utils/leanQueryByOptions");
const {
  authenticateUser,
  resignFirebaseUser,
} = require("../../../config/auth");
const { bibinoPrivateKey } = require("../../../config");

const signInUser = async (req, res, next) => {
  const authorization = req.get("authorization");
  let userName, userEmail, userProfileImagePath, uid;

  if (authorization?.startsWith("Bearer ")) {
    try {
      const idTokenByGoogle = getidToken(authorization);
      const userData = await authenticateUser(idTokenByGoogle);
      userName = userData.name;
      userEmail = userData.email;
      userProfileImagePath = userData.picture;
      uid = userData.uid;
    } catch (err) {
      return next(createError(401, err));
    }

    try {
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        {
          name: userName,
          imagePath: userProfileImagePath,
          $push: { uids: uid },
        },
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
    const { userId } = req.params;
    const user = await leanQueryByOptions(User.findById(userId));

    res.json(user);
  } catch (err) {
    next(createError(500, err));
  }
};

const getUserRecommendations = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await leanQueryByOptions(User.findById(userId));
    const beers = await leanQueryByOptions(Beer.find());
    const recommendations = sortBeersByEuclideanDistance(user, beers).slice(
      0,
      5
    );

    res.json(recommendations);
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports = { signInUser, getUser, getUserRecommendations, resignUser };

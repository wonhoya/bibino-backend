const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../../../models/User");
const Beer = require("../../../models/Beer");

const getidToken = require("../../../utils/getIdToken");
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
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    next(createError(err));
  }
};

module.exports = { getUser, signInUser };

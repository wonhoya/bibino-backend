const createError = require("http-errors");
const jwt = require('jsonwebtoken');

const User = require("../../../models/User");

const getidToken = require("../../../utils/getIdToken");
const authenticateUser = require("../../../config/auth");

const signInUser = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    try {
      const idToken = getidToken(authorization);
      const { name, email, picture } = await authenticateUser(idToken);
      const user = await User.findOneAndUpdate({ email }, { name, email, imagePath: picture }, { upsert: true, lean: true, new: true });

      const accessToken = jwt.sign(user._id.toString(), process.env.PRIVATE_KEY);

      return res.json({ user, accessToken });

    } catch (err) {
      next(createError(500, `Can't insert a new User in DB.\nOriginal error message: ${err.message}`));
    }
  }
};

exports.signInUser = signInUser;

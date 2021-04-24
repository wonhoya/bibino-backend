const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../../../models/User");
const Beer = require("../../../models/Beer");

const sortBeersByEuclideanDistance = require("../../../utils/sortBeersByEuclideanDistance");
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
    console.log(id);
    const user = await leanQueryByOptions(User.findById(id));

    res.json(user);
  } catch (err) {
    next(createError(500, err));
  }
};

const getUserRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await leanQueryByOptions(User.findById(id));
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

const submitUserReview = async (req, res, next) => {
  try {
    console.log("user review", req.body);

    // ==> 프론트에서 받아오는 데이터
    // user review {
    //   review: {
    //     rating: 4,
    //     aroma: 2.980768918991089,
    //     body: 2.873931884765625,
    //     flavor: 8.04487133026123
    //   },
    //   comment: '이맥주 괜찮다'
    // }

    // 유저 코멘트 서버 저장 로직이 여기 들어감

    res.json({ message: "Submit success", payload: {} });
  } catch (err) {
    next(createError(500, err));
  }
};

module.exports = {
  signInUser,
  getUser,
  getUserRecommendations,
  submitUserReview,
};

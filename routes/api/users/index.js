const router = require("express").Router();

const {
  signInUser,
  getUser,
  getUserRecommendations,
  submitUserReview,
} = require("./controller");
const authorizeUser = require("../../../middlewares/authorizeUser");

router.route("/sign-in").post(signInUser);

router.route("/:id/review").post(submitUserReview);

router.all("*", authorizeUser);

router.route("/:id").get(getUser);

router.route("/:id/recommendations").get(getUserRecommendations);

module.exports = router;

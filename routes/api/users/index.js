const router = require("express").Router();

const {
  signInUser,
  getUser,
  getUserRecommendations,
  resignUser,
} = require("./controller");
const authorizeUser = require("../../../middlewares/authorizeUser");

router.route("/sign-in").post(signInUser);

router.all("*", authorizeUser);

router.route("/:userId").get(getUser);

router.route("/:userId/recommendations").get(getUserRecommendations);

router.route("/resign").delete(resignUser);

module.exports = router;

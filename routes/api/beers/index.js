const router = require("express").Router();

const {
  searchBeer,
  getBeer,
  getBeerComments,
  getBeerRecommendations,
  scanPhoto,
} = require("./controller");
const reviewsRouter = require("../reviews");

router.use("/:beerId/reviews", reviewsRouter);

router.route("/scan").post(scanPhoto);

router.route("/search").get(searchBeer);

router.route("/:beerId").get(getBeer);

router.route("/:beerId/comments").get(getBeerComments);

router.route("/:beerId/recommendations").get(getBeerRecommendations);

module.exports = router;

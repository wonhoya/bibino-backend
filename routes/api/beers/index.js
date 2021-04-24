const router = require("express").Router();

const {
  searchBeer,
  getBeer,
  getBeerComments,
  getBeerRecommendations,
  scanPhoto,
} = require("./controller");

router.route("/scan").post(scanPhoto);

router.route("/search").get(searchBeer);

router.route("/:id").get(getBeer);

router.route("/:id/comments").get(getBeerComments);

router.route("/:id/recommendations").get(getBeerRecommendations);

module.exports = router;

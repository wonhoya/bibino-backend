const router = require("express").Router();

const {
  searchBeer,
  getBeer,
  getBeerComments,
  getBeerRecommendations,
} = require("./controller");

router.route("/search").post(searchBeer);

router.route("/:id").get(getBeer);

router.route("/:id/comments").get(getBeerComments);

router.route("/:id/recommendations").get(getBeerRecommendations);

module.exports = router;

const router = require("express").Router();

const {
  getBeer,
  getBeerStats,
  getBeerComments,
  //getRecommendationsByBeer,
} = require("./controller");

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

//router.route("/:id/recommendations").get(getRecommendationsByBeer);

module.exports = router;

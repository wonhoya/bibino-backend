const router = require("express").Router();

const {
  searchBeer,
  getBeer,
  getBeerStats,
  getBeerComments,
} = require("./controller");

router.route("/search").post(searchBeer);

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

module.exports = router;

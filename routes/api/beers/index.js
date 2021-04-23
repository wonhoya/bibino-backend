const router = require("express").Router();

const {
  getBeers,
  getBeer,
  getBeerStats,
  getBeerComments,
} = require("./controller");

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

router.route("/").get(getBeers);

module.exports = router;

const router = require("express").Router();

const {
  searchBeer,
  getBeer,
  getBeerStats,
  getBeerComments,
  scanPhoto,
} = require("./controller");

router.route("/scan").post(scanPhoto);
router.route("/:id").post(getBeer);
router.route("/search").get(searchBeer);

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

module.exports = router;

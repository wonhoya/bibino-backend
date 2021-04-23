const router = require("express").Router();

const {
  getBeers,
  getBeer,
  getBeerStats,
  getBeerComments,
  scanPhoto,
} = require("./controller");

router.route("/scan").get(scanPhoto);
router.route("/:id").post(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

router.route("/").get(getBeers);

module.exports = router;

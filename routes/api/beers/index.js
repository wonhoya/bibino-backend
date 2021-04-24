const router = require("express").Router();
const authorizeUser = require("../../../middlewares/authorizeUser");

const {
  searchBeer,
  getBeer,
  getBeerStats,
  getBeerComments,
  scanPhoto,
} = require("./controller");

router.route("*").all(authorizeUser);
router.route("/scan").post(scanPhoto);
router.route("/:id").post(getBeer);
router.route("/search").get(searchBeer);

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

module.exports = router;

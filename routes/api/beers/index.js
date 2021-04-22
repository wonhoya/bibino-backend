const router = require("express").Router();

const { getBeer, getBeerStats, getBeerComments } = require("./controller");

router.route("/:id").get(getBeer);

router.route("/:id/stats").get(getBeerStats);

router.route("/:id/comments").get(getBeerComments);

module.exports = router;

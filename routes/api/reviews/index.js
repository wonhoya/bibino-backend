const router = require("express").Router();

const { createReview } = require("./controller");

router.route("/new").post(createReview);

router.route("/").get(getBeerReview);

module.exports = router;

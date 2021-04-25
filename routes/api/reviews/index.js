const router = require("express").Router();

const { createReview, getReview, updateReview } = require("./controller");

router.route("/new").post(createReview);

router.route("/single").get(getReview).patch(updateReview);

module.exports = router;

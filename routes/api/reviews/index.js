const router = require("express").Router();

const { createReview } = require("./controller");

router.route("/new").post(createReview);

module.exports = router;

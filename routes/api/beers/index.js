const router = require("express").Router();

const { getBeer } = require("./controller");

router.route("/:id").get(getBeer);

module.exports = router;

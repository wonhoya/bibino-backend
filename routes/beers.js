const router = require("express").Router();

const { getBeer } = require("./controllers/beers.controller");

router.route("/:id").get(getBeer);

module.exports = router;

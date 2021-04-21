const router = require("express").Router();

const { getIndex } = require("./controller");

router.route("/").get(getIndex);

module.exports = router;

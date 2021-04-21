const router = require("express").Router();

const { getUser } = require("./controller");

router.route("/").get(getUser);

module.exports = router;

const router = require("express").Router();

const { getMain, getProfile } = require("./controller");

router.route("/").get(getMain);

router.route("/profile").get(getProfile);

module.exports = router;

const router = require("express").Router();

const { getIndex, getProfile } = require("./controllers/index.controller");
const { uploadProfileMulter } = require("../utils/multers");

router.route("/").get(getIndex);

router.route("/profile").get(uploadProfileMulter.single("ABC"), getProfile);

module.exports = router;

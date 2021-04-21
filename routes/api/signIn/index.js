const router = require("express").Router();

const { signInUser } = require("./controller");

router.route("/").post(signInUser);

module.exports = router;

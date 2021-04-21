const router = require("express").Router();

const { signInUser } = require("./controllers/signIn.controller");

router.route("/").post(signInUser);

module.exports = router;

const router = require("express").Router();

const { getUser, signInUser } = require("./controller");
const authorizeUser = require("../../../middlewares/authorizeUser");

router.route("/sign-in").post(signInUser);
router.all("*", authorizeUser);
router.route("/:user").get(getUser);

module.exports = router;

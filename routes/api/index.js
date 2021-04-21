const router = require("express").Router();

const auth = require("./auth");
const user = require("./user");
const beers = require("./beers");

router.use("/auth", auth);
router.use("/user", user);
router.use("/beers", beers);

module.exports = router;

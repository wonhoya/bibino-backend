const router = require("express").Router();
const auth = require("./auth");
const beers = require("./beers");

router.use("/auth", auth);
router.use("/beers", beers);

module.exports = router;

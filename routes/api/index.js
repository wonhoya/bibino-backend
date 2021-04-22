const router = require("express").Router();
const beers = require("./beers");
const siginIn = require("./signIn");

router.use("/beers", beers);
router.use("/signIn", siginIn);

module.exports = router;

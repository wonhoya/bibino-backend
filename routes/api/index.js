const router = require("express").Router();

const users = require("./users");
const beers = require("./beers");
const siginIn = require("./signIn");

router.use("/users", users);
router.use("/beers", beers);
router.use("/signIn", siginIn);

module.exports = router;

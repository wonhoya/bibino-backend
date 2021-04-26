const router = require("express").Router();

const users = require("./users");
const beers = require("./beers");
const reviews = require("./reviews");

router.use("/users", users);
router.use("/beers", beers);
router.use("/reviews", reviews);

module.exports = router;

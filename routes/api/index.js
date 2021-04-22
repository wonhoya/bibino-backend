const router = require("express").Router();

const users = require("./users");
const beers = require("./beers");

router.use("/users", users);
router.use("/beers", beers);

module.exports = router;

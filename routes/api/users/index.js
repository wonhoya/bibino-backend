const router = require("express").Router();

const { getUser } = require("./controller");

router.route("/:user").get(getUser);

module.exports = router;

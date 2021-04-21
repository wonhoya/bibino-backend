const router = require("express").Router();

const { getBeer, scanPhoto } = require("./controller");

router.route("/scan").get(scanPhoto);
router.route("/:id").post(getBeer);

module.exports = router;

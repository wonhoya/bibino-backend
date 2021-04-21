const router = require("express").Router();

const { getBeer, scanPhoto } = require("./controller");

router.route("/scan").post(scanPhoto);
router.route("/:id").post(getBeer);

module.exports = router;

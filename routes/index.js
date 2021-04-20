// 폴더 구조 예제를 위한 파일입니다. 삭제 후 진행하시면 됩니다.

const router = require("express").Router();

const { getIndex, getProfile } = require("./controllers/index.controller");

router.route("/").get(getIndex);

router.route("/profile").get(getProfile);

module.exports = router;

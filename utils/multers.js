const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const { BIBINO } = require("../constants/bucket");
const { USER_BEERS, BEERS } = require("../constants/folder");

const uploadProfileMulter = multer({
  storage: multerS3({
    s3,
    bucket: `${BIBINO}/${USER_BEERS}`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = { uploadProfileMulter };

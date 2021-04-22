const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const {
  BUCKET,
  USER_BEERS,
  BEERS,
  ACL,
  CONTENT_ENCODING,
} = require("../../../constants/awsParams");
const base64 = require("./mock");
const buffer = new Buffer.from(base64, "base64");

const Beer = require("../../../models/Beer");
const User = require("../../../models/User");

const getMain = async (req, res) => {
  // await Beer.create({
  //   name: "test",
  //   imagePath:
  //     "https://bibino.s3.ap-northeast-2.amazonaws.com/user-beers/abcde",
  //   description: "AERIRIRIRI",
  // });
  // res.send("hi");
  const user = await User.create({
    email: "biocle8339@gmail.com",
    name: "wonho",
    imagePath: "abc.com",
  });

  res.json("success");
};

const getProfile = (req, res) => {
  const params = {
    Bucket: `${BUCKET}/${USER_BEERS}`,
    Key: "abcde",
    Body: buffer,
    ACL,
    ContentEncoding: CONTENT_ENCODING,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw new Error("s3 upload failed");
    }

    if (data) {
      res.send("Successfully upload files!");
    }
  });
};

module.exports = { getMain, getProfile };

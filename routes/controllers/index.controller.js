const getIndex = (req, res, next) => {
  res.send("Hello bibino!");
};

const getProfile = (req, res, next) => {
  // const uploadParams = {
  //   Bucket: `${BIBINO}/${USER_BEERS}`,
  //   Key: "test",
  //   Body: "",
  // };
  // const filePath = `${__dirname}/a.png`;
  // const fileStream = fs.createReadStream(filePath);

  // fileStream.on("error", function (err) {
  //   console.log("File Error", err);
  // });

  // uploadParams.Body = fileStream;
  // uploadParams.Key = path.basename(filePath);

  // // call S3 to retrieve upload file to specified bucket
  // await s3.upload(uploadParams, function (err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   }
  //   if (data) {
  //     console.log("Upload Success", data.Location);
  //   }
  // });
  res.send("Successfully uploaded " + req.files.length + " files!");
};

module.exports = { getIndex, getProfile };

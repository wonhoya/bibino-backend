const getToken = require("../../utils/getToken");

const signInUser = (req, res, next) => {
  const { authorization } = req.header;
  let accessToken;

  if (authorization.startsWith("Bearer")) {
    accessToken = getToken(authorization);
  }
  res.json({ result: "sucess" })
};

exports.signInUser = signInUser;

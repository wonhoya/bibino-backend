const getidToken = require("../../../utils/getToken");
const { authenticateUser } = require("../../../config/auth.js");

const signInUser = async (req, res, next) => {
  const { authorization } = req.header;
  let idToken;

  if (authorization.startsWith("Bearer")) {
    idToken = getidToken(authorization);
    await authenticateUser(idToken);
  }

};

exports.signInUser = signInUser;

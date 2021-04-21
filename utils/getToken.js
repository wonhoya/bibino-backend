const getidToken = (authorization) => {
  return authorization.slice(authorization.indexOf(" ") + 1);
};

module.exports = getidToken;

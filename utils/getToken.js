const getToken = (authorization) => {
  return authorization.slice(authorization.indexOf(" ") + 1);
};

module.exports = getToken;

const createError = require("http-errors");

const User = require("../../../models/User");

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    next(createError(err));
  }
};

module.exports = { getUser };

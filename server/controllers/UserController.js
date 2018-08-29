const Joi = require("joi");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const userSchemas = require("./validation/users");
const config = require("../../config/index");

module.exports.signupUser = async (req, res, next) => {
  try {
    await Joi.validate(req, userSchemas.signupUser, { allowUnknown: true });

    const { username, password } = req.body;
    const user = await User.newUser({ username, password });

    res.send({ user });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  return res.send({
    token: jwt.sign({ id: req.user._id, username: req.user.username }, config.sessionSecret),
  });
};

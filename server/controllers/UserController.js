const Joi = require("joi");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const queryString = require("query-string");

const User = require("../models/User");
const userSchemas = require("./validation/users");
const config = require("../../config/index");

const GITHUB_OAUTH_ROUTE = "https://github.com/login/oauth/access_token";
const GITHUB_USER_ROUTE = "https://api.github.com/user";

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

module.exports.githubUser = async (req, res, next) => {
  try {
    await Joi.validate(req, userSchemas.githubUser, { allowUnknown: true });

    // Request access token
    const response = await axios.post(GITHUB_OAUTH_ROUTE, {
      code: req.body.code,
      client_id: config.githubOAuthClientId,
      client_secret: config.githubOAuthClientSecret,
    });

    const auth = queryString.parse(response.data);

    // Request user profile object
    const opts = { headers: { Authorization: `token ${auth.access_token}` } };
    const { data } = await axios.get(GITHUB_USER_ROUTE, opts);

    let user = await User.findOne({ email: data.email });

    if (!user) {
      user = await User.create({
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        github_id: data.id,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.sessionSecret,
    );

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

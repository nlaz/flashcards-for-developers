const Joi = require("joi");
const axios = require("axios");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");

const User = require("../models/User");
const userSchemas = require("./validation/users");
const config = require("../../config/index");

const GITHUB_OAUTH_ROUTE = "https://github.com/login/oauth/access_token";
const GITHUB_USER_ROUTE = "https://api.github.com/user";

module.exports.githubUser = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.githubUser);

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

module.exports.setSavedDecks = async (req, res, next) => {
  try {
    await Joi.validate(req, userSchemas.setSavedDecks);

    const { decks } = req.body;

    const user = await User.findOneAndUpdate({ _id: req.user }, { saved_decks: decks }).select(
      "+saved_decks",
    );

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getSavedDecks = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user }).select("+saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.addStudyHistory = async (req, res, next) => {
  try {
    await Joi.validate(req, userSchemas.setStudyHistory, { allowUnknown: true });
    const user = await User.findOne({ _id: req.user }).select("+study_history");
    const { date } = req.body;
    const { study_history = [] } = user;

    const history = [...study_history, moment(date).format()].filter(
      (elem, pos, arr) => arr.indexOf(elem) === pos,
    );

    const newUser = await User.findOneAndUpdate(
      { _id: req.user },
      { study_history: history },
    ).select("+study_history");

    res.send(newUser.study_history);
  } catch (error) {
    next(error);
  }
};

module.exports.getStudyHistory = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user }).select("+study_history");

    res.send(user.study_history);
  } catch (error) {
    next(error);
  }
};

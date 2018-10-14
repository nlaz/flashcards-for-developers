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
const MAILCHIMP_ROUTE = "https://us17.api.mailchimp.com";
const MEMBERSHIP_LIST = "6aa2bb18b4";

module.exports.getGithubUser = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.getGithubUser);

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

    let user = await User.findOne({ github_id: data.id });

    if (!user) {
      return res.status(403).json({
        message: "User not found. Please provide required fields.",
        profile: {
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          github_id: data.id,
        },
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

module.exports.createGithubUser = async (req, res, next) => {
  try {
    const { email, name, avatar_url, github_id } = req.body;

    await Joi.validate(req.body, userSchemas.createGithubUser);

    const user = await User.create({ email, name, avatar_url, github_id });

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

module.exports.subscribeUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const route = `${MAILCHIMP_ROUTE}/3.0/lists/${MEMBERSHIP_LIST}/members/`;
    const auth = { username: "mailchimp", password: config.mailchimpApiKey };
    const query = { email_address: email, status: "subscribed" };

    await Joi.validate(req.body, userSchemas.subscribeUser);

    // Subscribe user to membership list
    await axios.post(route, query, { auth });

    res.send({ message: "Success!" });
  } catch (error) {
    next(error);
  }
};

module.exports.getPinnedDecks = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user })
      .select("+saved_decks")
      .populate("saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserPinnedDecks = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId })
      .select("+saved_decks")
      .populate("saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.addPinnedDecks = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.addPinnedDecks);

    const { decks } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user },
      { $addToSet: { saved_decks: decks } },
      { new: true },
    )
      .select("+saved_decks")
      .populate("saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.removePinnedDeck = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.removePinnedDeck);

    const { deck } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user },
      { $pull: { saved_decks: deck } },
      { new: true },
    )
      .select("+saved_decks")
      .populate("saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.addStudySessions = async (req, res, next) => {
  try {
    const { dates } = req.body;

    await Joi.validate(req.body, userSchemas.addStudySessions);

    const fmtDates = dates.map(el => moment(el).format());
    const user = await User.findOneAndUpdate(
      { _id: req.user },
      { $addToSet: { study_sessions: fmtDates } },
      { new: true },
    ).select("+study_sessions");

    res.send(user.study_sessions);
  } catch (error) {
    next(error);
  }
};

module.exports.getStudySessions = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user }).select("+study_sessions");

    res.send(user.study_sessions);
  } catch (error) {
    next(error);
  }
};

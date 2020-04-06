const Joi = require("joi");
const axios = require("axios");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");
const Stripe = require("stripe");

const streaks = require("../utils/streaks");
const User = require("../models/User");
const Deck = require("../models/Deck");
const CardProgress = require("../models/CardProgress");
const ReviewEvent = require("../models/ReviewEvent");
const userSchemas = require("./validation/users");
const config = require("../../config/index");

const GITHUB_OAUTH_ROUTE = "https://github.com/login/oauth/access_token";
const GITHUB_USER_ROUTE = "https://api.github.com/user";
const MAILCHIMP_ROUTE = "https://us17.api.mailchimp.com";
const MEMBERSHIP_LIST = "6aa2bb18b4";
const SUBSCRIPTION_PLAN = "pro_monthly";

const stripe = Stripe(config.stripePrivateKey);

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
          username: data.login,
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
    const { email, name, avatar_url, github_id, username, email_notification } = req.body;

    await Joi.validate(req.body, userSchemas.createGithubUser);

    const user = await User.create({
      email,
      name,
      avatar_url,
      github_id,
      email_notification,
      username,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      config.sessionSecret,
    );

    // Subscribe user to membership list
    if (email_notification) {
      const route = `${MAILCHIMP_ROUTE}/3.0/lists/${MEMBERSHIP_LIST}/members/`;
      const auth = { username: "mailchimp", password: config.mailchimpApiKey };
      const query = { email_address: email, status: "subscribed" };
      try {
        await axios.post(route, query, { auth });
      } catch (error) {
        console.log("❌ 📨 Email list - ", error.message);
      }
    }

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.postStripeCharge = async (req, res, next) => {
  try {
    const { source } = req.body;

    const user = await User.findOne({ _id: req.user });
    const customer = await stripe.customers.create({
      email: user.email,
      source: source,
    });

    await stripe.subscriptions.create({
      customer: customer.id,
      plan: SUBSCRIPTION_PLAN,
    });

    // Add customer Id to user model
    const newUser = await User.findOneAndUpdate(
      { _id: req.user },
      { $set: { customerId: customer.id, user_plan: SUBSCRIPTION_PLAN } },
      { new: true },
    );

    res.send({ message: "Success!", user: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.cancelStripeSubscription = async (req, res, next) => {
  try {

    const user = await User.findOne({ _id: req.user }).select('customerId');
    
    if(!user){
      throw new Error();
    }

    const stripeCustomer = await stripe.customers.retrieve(user.customerId);
    
    const [subscription] = stripeCustomer.subscriptions.data;

    await stripe.subscriptions.del(subscription.id);

    // Remove customer ID from user model and reset user plan
    const newUser = await User.findOneAndUpdate(
      { _id: req.user },
      { $set: { user_plan: "free" } },
      { new: true },
    );

    res.send({ message: "Success!", user: newUser });
    }

    catch (error) {
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

module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user });

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, email_notification, username } = req.body;

    await Joi.validate(req.body, userSchemas.updateUserProfile);

    const user = await User.findOneAndUpdate(
      { _id: req.user },
      { $set: { name, email, email_notification, username } },
      { new: true },
    );

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProfile = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.user });

    await Deck.updateMany({ author: req.user }, { $set: { status: "private" } });

    res.send({ message: "Success! Account deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const profile = {
      avatar_url: user.avatar_url,
      name: user.name,
      id: String(user._id),
      username: user.username,
    };

    await Joi.validate(profile, userSchemas.userProfile);

    res.send(profile);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserReviews = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const reviews = await ReviewEvent.aggregate([
      { $match: { user: user._id } },
      { $project: { yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
      { $group: { _id: "$yearMonthDay", count: { $sum: 1 } } },
    ]);

    res.send(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserPinnedDecks = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("+saved_decks")
      .populate("saved_decks");

    res.send(user.saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserActivity = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    const reviews = await ReviewEvent.find({ user: user._id });
    const studyDates = [...new Set(reviews.map(el => moment(el.createdAt).format("YYYY-DD-MM")))];
    const cardProgresses = await CardProgress.find({ user: user._id });
    const masteredCards = await CardProgress.find({ user: user._id, leitnerBox: { $gt: 5 } });

    const currentStreak = streaks.getCurrentStreak(studyDates);
    const longestStreak = streaks.getLongestStreak(studyDates);

    res.send({
      cards_seen: cardProgresses.length,
      mastered_cards: masteredCards.length,
      current_streak: currentStreak,
      longest_streak: longestStreak,
    });
  } catch (error) {
    next(error);
  }
};

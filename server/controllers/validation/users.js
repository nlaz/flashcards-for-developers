const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getGithubUser: {
    code: Joi.string().required(),
  },
  userProfile: {
    id: Joi.objectId().required(),
    name: Joi.string().required(),
    avatar_url: Joi.string(),
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15),
  },
  createGithubUser: {
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    avatar_url: Joi.string(),
    github_id: Joi.number().required(),
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15),
    email_notification: Joi.boolean(),
  },
  addPinnedDecks: {
    decks: Joi.array()
      .items(Joi.objectId())
      .required(),
  },
  removePinnedDeck: {
    deck: Joi.objectId().required(),
  },
  addStudySessions: {
    dates: Joi.array()
      .items(Joi.string())
      .required(),
  },
  addDeckStudyProgress: {
    card: Joi.objectId().required(),
    reviewedAt: Joi.string().required(),
    isCorrect: Joi.boolean(),
  },
  updateUserProfile: {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .allow(""),
    email_notification: Joi.boolean(),
  },
};

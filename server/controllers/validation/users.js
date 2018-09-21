const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getGithubUser: {
    code: Joi.string().required(),
  },
  createGithubUser: {
    email: Joi.string().required(),
    name: Joi.string().required(),
    avatar_url: Joi.string(),
    github_id: Joi.number().required(),
  },
  addSavedDecks: {
    decks: Joi.array()
      .items(Joi.objectId())
      .required(),
  },
  removeSavedDeck: {
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
};

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
  subscribeUser: {
    email: Joi.string()
      .email()
      .required(),
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
};

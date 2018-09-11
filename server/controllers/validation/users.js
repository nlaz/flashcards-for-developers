const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getGithubUser: {
    code: Joi.string().required(),
  },
  addSavedDeck: {
    deck: Joi.objectId().required(),
  },
  removeSavedDeck: {
    deck: Joi.objectId().required(),
  },
  addStudySession: {
    date: Joi.string().required(),
  },
  addDeckStudyProgress: {
    card: Joi.objectId().required(),
    reviewedAt: Joi.string().required(),
    isCorrect: Joi.boolean(),
  },
};

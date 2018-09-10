const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getGithubUser: {
    code: Joi.string().required(),
  },
  setSavedDecks: {
    decks: Joi.array().items(Joi.objectId()),
  },
  addStudySession: {
    date: Joi.string().required(),
  },
};

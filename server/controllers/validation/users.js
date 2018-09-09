const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  githubUser: {
    code: Joi.string().required(),
  },
  setSavedDecks: {
    decks: Joi.array().items(Joi.objectId()),
  },
  setStudyHistory: {
    body: Joi.object().keys({
      date: Joi.string().required(),
    }),
  },
};

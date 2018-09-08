const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  githubUser: {
    code: Joi.string().required(),
  },
  saveDecks: {
    decks: Joi.array().items(Joi.objectId()),
  },
};

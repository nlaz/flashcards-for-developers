const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getDecksQuery: {
    collection: Joi.objectId(),
    ids: Joi.string(),
  },
  createDeck: {
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    status: Joi.string().valid("private", "public"),
  },
  getDeckParams: {
    deckId: Joi.objectId().required(),
  },
  updateDeck: {
    name: Joi.string().required(),
    description: Joi.string().allow(""),
  },
  deleteDeck: {
    deckId: Joi.objectId().required(),
  },
  proUser: Joi.string()
    .valid("pro_monthly")
    .required(),
  searchDecks: {
    search: Joi.string(),
  },
};

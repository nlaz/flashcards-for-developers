const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getDecksQuery: {
    collection: Joi.objectId(),
  },
  getDeckParams: {
    deckId: Joi.objectId().required(),
  },
};

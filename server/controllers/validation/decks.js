const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getDecksQuery: {
    collection: Joi.objectId(),
    ids: Joi.string(),
  },
  getDeckParams: {
    deckId: Joi.objectId().required(),
  },
  getDecksIds: Joi.array().items(Joi.objectId()),
};

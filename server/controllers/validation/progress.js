const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getProgress: {
    user: Joi.objectId().required(),
  },
  getDeckProgress: {
    user: Joi.objectId().required(),
    params: {
      deckId: Joi.objectId().required(),
    },
  },
  addProgress: {
    user: Joi.objectId().required(),
    params: {
      deckId: Joi.objectId().required(),
      cardId: Joi.objectId().required(),
    },
    body: {
      leitnerBox: Joi.number().required(),
      reviewedAt: Joi.string().required(),
    },
  },
};

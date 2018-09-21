const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getCardsQuery: {
    deck: Joi.objectId(),
    collection: Joi.string(),
  },
};

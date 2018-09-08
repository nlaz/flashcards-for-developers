const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getCollection: {
    collectionId: Joi.objectId(),
  },
};

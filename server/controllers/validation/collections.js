const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getCollections: {
    search: Joi.string(),
  },
  getCollection: {
    collectionId: Joi.objectId(),
  },
};

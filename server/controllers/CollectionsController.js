const Joi = require("joi");
const Collection = require("../models/Collection");

const collectionSchemas = require("./validation/collections");

module.exports.getCollection = async (req, res, next) => {
  try {
    await Joi.validate(req.params, collectionSchemas.getCollection);

    const { collectionId } = req.params;

    const collection = await Collection.findOne({ _id: collectionId });

    res.send(collection);
  } catch (error) {
    next(error);
  }
};

const Joi = require("joi");
const Collection = require("../models/Collection");

const collectionSchemas = require("./validation/collections");

module.exports.getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ hidden: { $ne: true } });

    res.send(collections);
  } catch (error) {
    next(error);
  }
};

module.exports.getCollection = async (req, res, next) => {
  try {
    await Joi.validate(req.params, collectionSchemas.getCollection);

    const { collectionId } = req.params;

    const collection = await Collection.findOne({ _id: collectionId }).populate("decks");
    res.send(collection);
  } catch (error) {
    next(error);
  }
};

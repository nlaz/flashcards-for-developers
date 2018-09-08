const Joi = require("joi");

const Deck = require("../models/Deck");
const Collection = require("../models/Collection");
const deckSchemas = require("./validation/decks");

module.exports.getDecks = async (req, res, next) => {
  try {
    await Joi.validate(req.query, deckSchemas.getDecksQuery);

    const collectionId = req.query.collection;

    const collection = collectionId
      ? await Collection.findOne({ _id: collectionId }).populate("decks")
      : {};

    const decks = collectionId ? collection.decks : await Deck.find();

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeck = async (req, res, next) => {
  try {
    await Joi.validate(req.params, deckSchemas.getDeckParams);

    const { deckId } = req.params;

    const deck = await Deck.findOne({ _id: deckId });

    res.send(deck);
  } catch (error) {
    next(error);
  }
};

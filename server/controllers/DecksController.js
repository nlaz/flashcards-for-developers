const Joi = require("joi");

const Deck = require("../models/Deck");
const Card = require("../models/Card");
const Collection = require("../models/Collection");
const deckSchemas = require("./validation/decks");

module.exports.getDecks = async (req, res, next) => {
  try {
    let decks;
    const collectionId = req.query.collection;
    const deckIds = req.query.ids.split(",");

    await Joi.validate(req.query, deckSchemas.getDecksQuery);
    await Joi.validate(deckIds, deckSchemas.getDecksIds);

    if (collectionId) {
      const collection = await Collection.findOne({ _id: collectionId }).populate("decks");
      decks = collection.decks;
    } else if (deckIds) {
      decks = await Deck.find({ _id: { $in: deckIds } });
    } else {
      decks = await Deck.find();
    }

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

module.exports.createDeck = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await Joi.validate(req.body, deckSchemas.createDeck);

    const deck = await Deck.create({ name, description, author: req.user, status: "private" });

    res.send(deck);
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

module.exports.updateDeck = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { deckId } = req.params;

    await Joi.validate(req.body, deckSchemas.updateDeck);

    const deck = await Deck.findOneAndUpdate(
      { _id: deckId, author: req.user },
      { $set: { name, description } },
      { new: true },
    );

    res.send(deck);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    await Joi.validate(req.params, deckSchemas.deleteDeck);

    await Deck.deleteOne({ _id: deckId, author: req.user });

    await Card.deleteMany({ deck: deckId, author: req.user });

    res.send({ message: "Success! Deck removed." });
  } catch (error) {
    next(error);
  }
};

module.exports.getDecksForUser = async (req, res, next) => {
  try {
    const decks = await Deck.find({ author: req.user });

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

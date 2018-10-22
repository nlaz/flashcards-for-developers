const Joi = require("joi");

const User = require("../models/User");
const Card = require("../models/Card");
const Collection = require("../models/Collection");
const cardSchemas = require("./validation/cards");

module.exports.getCards = async (req, res, next) => {
  try {
    let cards;
    const deckId = req.query.deck;
    const collectionId = req.query.collection;
    const deckIds = req.query.deckIds;

    await Joi.validate(req.query, cardSchemas.getCardsQuery);

    if (collectionId === "pinned") {
      const user = await User.findOne({ _id: req.user }).select("+saved_decks");
      cards = await Card.find({ deck: { $in: user.saved_decks } }).populate("deck");
    } else if (collectionId) {
      const collection = await Collection.findOne({ _id: collectionId }).select("+decks");
      cards = await Card.find({ deck: { $in: collection.decks } }).populate("deck");
    } else if (deckIds && deckIds.length > 0) {
      cards = await Card.find({ deck: { $in: deckIds } }).populate("deck");
    } else if (deckId) {
      cards = await Card.find({ deck: deckId });
    }

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { front, back, deck } = req.body;
    await Joi.validate(req.body, cardSchemas.createCard);

    const card = await Card.create({ deck, back, front });

    res.send(card);
  } catch (error) {
    next(error);
  }
};

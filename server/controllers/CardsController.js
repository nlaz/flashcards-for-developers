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
    const user = await User.findOne({ _id: req.user });

    await Joi.validate(req.body, cardSchemas.createCard);
    await Joi.validate(user.user_plan, cardSchemas.proUser);

    const card = await Card.create({ deck, back, front, author: req.user });

    res.send(card);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    await Joi.validate(req.params, cardSchemas.deleteCard);

    await Card.deleteOne({ _id: cardId, author: req.user });

    res.send({ message: "Success! Card removed." });
  } catch (error) {
    next(error);
  }
};

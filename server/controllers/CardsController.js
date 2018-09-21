const Joi = require("joi");

const Card = require("../models/Card");
const Collection = require("../models/Collection");
const cardSchemas = require("./validation/cards");

module.exports.getCards = async (req, res, next) => {
  try {
    let cards;
    const deckId = req.query.deck;
    const collectionId = req.query.collection;

    await Joi.validate(req.query, cardSchemas.getCardsQuery);

    if (collectionId) {
      const collection = await Collection.findOne({ _id: collectionId }).select("+decks");
      cards = await Card.find({ deck: { $in: collection.decks } })
        .limit(100)
        .populate("decks");
    } else if (deckId) {
      cards = await Card.find({ deck: deckId });
    }

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

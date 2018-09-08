const Deck = require("../models/Deck");
const Collection = require("../models/Collection");

module.exports.getDecks = async (req, res, next) => {
  try {
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
    const { deckId } = req.params;

    const deck = await Deck.findOne({ _id: deckId });

    res.send(deck);
  } catch (error) {
    next(error);
  }
};

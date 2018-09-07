const Deck = require("../models/Deck");

module.exports.getDecks = async (req, res, next) => {
  try {
    // const { collection } = req.query;

    const decks = await Deck.find();

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

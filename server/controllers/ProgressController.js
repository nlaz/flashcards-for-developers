const DeckProgress = require("../models/DeckProgress").Model;
const CardProgress = require("../models/CardProgress").Model;

module.exports.getStudyProgress = async (req, res, next) => {
  try {
    const deckProgress = await DeckProgress.find({ user: req.user }).populate("cards");

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeckProgress = async (req, res, next) => {
  try {
    const { deckId } = req.params;

    const deckProgress = await DeckProgress.findOne({ deck: deckId, user: req.user }).populate(
      "cards",
    );

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.addStudyProgress = async (req, res, next) => {
  try {
    const { deckId, cardId } = req.params;
    const { leitnerBox, reviewedAt } = req.body;

    const cardProgress = await CardProgress.findOneAndUpdate(
      {
        card: cardId,
        user: req.user,
        leitnerBox: leitnerBox,
        reviewedAt: reviewedAt,
      },
      { new: true, upsert: true },
    );

    await DeckProgress.findOneAndUpdate(
      { deck: deckId, user: req.user },
      { $addToSet: { cards: cardProgress } },
      { new: true, upsert: true },
    );

    res.send(cardProgress);
  } catch (error) {
    next(error);
  }
};

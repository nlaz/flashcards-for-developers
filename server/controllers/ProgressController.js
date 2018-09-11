const User = require("../models/User");
const DeckProgress = require("../models/DeckProgress").Model;
const CardProgress = require("../models/CardProgress").Model;

module.exports.getStudyProgress = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user })
      .select("+study_progress")
      .populate("study_progress");

    res.send(user.study_progress);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeckProgress = async (req, res, next) => {
  try {
    const { deckId } = req.params;

    const deckProgress = await DeckProgress.findOne({ deck: deckId, user: req.user });

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.addStudyProgress = async (req, res, next) => {
  try {
    // TODO
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

    const deckProgress = await DeckProgress.findOneAndUpdate(
      { deck: deckId, user: req.user },
      { $addToSet: { cards: cardProgress } },
      { new: true, upsert: true },
    );

    await User.findOneAndUpdate(
      { _id: req.user },
      { $addToSet: { study_progress: deckProgress } },
      { new: true, upsert: true },
    );

    res.send(cardProgress);
  } catch (error) {
    next(error);
  }
};

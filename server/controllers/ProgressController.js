const Joi = require("joi");

const DeckProgress = require("../models/DeckProgress").Model;
const CardProgress = require("../models/CardProgress").Model;

const progressSchemas = require("./validation/progress");

module.exports.getProgress = async (req, res, next) => {
  try {
    await Joi.validate(req.user, progressSchemas.getProgress.user);

    const deckProgress = await DeckProgress.find({ user: req.user }).populate("cards");

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeckProgress = async (req, res, next) => {
  try {
    const { deckId } = req.params;

    await Joi.validate(req.user, progressSchemas.getProgress.user);
    await Joi.validate(req.params, progressSchemas.getProgress.params);

    const deckProgress = await DeckProgress.findOne({ deck: deckId, user: req.user }).populate(
      "cards",
    );

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.addProgress = async (req, res, next) => {
  try {
    const { user } = req;
    const { deckId, cardId } = req.params;
    const { leitnerBox, reviewedAt } = req.body;

    await Joi.validate(req.user, progressSchemas.addProgress.user);
    await Joi.validate(req.params, progressSchemas.addProgress.params);
    await Joi.validate(req.body, progressSchemas.addProgress.body);

    const cardProgress = await CardProgress.findOneAndUpdate(
      {
        card: cardId,
        user: user,
        leitnerBox: leitnerBox,
        reviewedAt: reviewedAt,
      },
      { new: true, upsert: true },
    );

    await DeckProgress.findOneAndUpdate(
      { deck: deckId, user: user },
      { $addToSet: { cards: cardProgress } },
      { new: true, upsert: true },
    );

    res.send(cardProgress);
  } catch (error) {
    next(error);
  }
};

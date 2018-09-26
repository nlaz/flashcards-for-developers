const Joi = require("joi");

const DeckProgress = require("../models/DeckProgress").Model;
const CardProgress = require("../models/CardProgress").Model;

const progressSchemas = require("./validation/progress");

module.exports.getStudyProgress = async (req, res, next) => {
  try {
    await Joi.validate(req.user, progressSchemas.user);

    const deckProgress = await DeckProgress.find({ user: req.user }).populate("cards");

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.addStudyProgress = async (req, res, next) => {
  try {
    const { user } = req;
    const progressObjs = req.body;

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.body, progressSchemas.addStudyProgress);

    const studyProgresses = await Promise.all(
      progressObjs.map(async deckObj => {
        const cardProgresses = await Promise.all(
          deckObj.cards.map(async cardObj => {
            return await CardProgress.findOneAndUpdate(
              { card: cardObj.card, user: user },
              { leitnerBox: cardObj.leitnerBox, reviewedAt: cardObj.reviewedAt },
              { new: true, upsert: true },
            );
          }),
        );

        const deckProgress = await DeckProgress.findOneAndUpdate(
          { deck: deckObj.deck, user: user },
          { $addToSet: { cards: cardProgresses } },
          { new: true, upsert: true },
        ).populate("cards");

        return deckProgress;
      }),
    );

    res.send(studyProgresses);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeckProgress = async (req, res, next) => {
  try {
    const { deckId } = req.params;

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.params, progressSchemas.getDeckProgress.params);

    const deckProgress = await DeckProgress.findOne({
      deck: deckId,
      user: req.user,
    }).populate("cards");

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.addCardProgress = async (req, res, next) => {
  try {
    const { user } = req;
    const { deckId, cardId } = req.params;
    const { leitnerBox, reviewedAt } = req.body;

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.params, progressSchemas.addCardProgress.params);
    await Joi.validate(req.body, progressSchemas.addCardProgress.body);

    const cardProgress = await CardProgress.findOneAndUpdate(
      { card: cardId, user: user },
      { leitnerBox: leitnerBox, reviewedAt: reviewedAt },
      { new: true, upsert: true },
    );

    const deckProgress = await DeckProgress.findOneAndUpdate(
      { deck: deckId, user: user },
      { $addToSet: { cards: cardProgress } },
      { new: true, upsert: true },
    ).populate("cards");

    res.send(deckProgress);
  } catch (error) {
    next(error);
  }
};

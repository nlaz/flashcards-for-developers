const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  user: Joi.objectId().required(),
  getDeckProgress: {
    user: Joi.objectId().required(),
    params: {
      deckId: Joi.objectId().required(),
    },
  },
  addStudyProgress: Joi.array()
    .items(
      Joi.object().keys({
        deck: Joi.objectId().required(),
        cards: Joi.array().items(
          Joi.object().keys({
            card: Joi.objectId().required(),
            reviewedAt: Joi.string().required(),
            leitnerBox: Joi.number().required(),
          }),
        ),
      }),
    )
    .required(),
  addCardProgress: {
    params: {
      deckId: Joi.objectId().required(),
      cardId: Joi.objectId().required(),
    },
    body: {
      leitnerBox: Joi.number().required(),
      reviewedAt: Joi.string().required(),
    },
  },
};

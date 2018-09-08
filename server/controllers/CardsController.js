const Joi = require("joi");

const Card = require("../models/Card");
const cardSchemas = require("./validation/cards");

module.exports.getCards = async (req, res, next) => {
  try {
    await Joi.validate(req.params, cardSchemas.getCardsQuery);

    const { deck } = req.query;

    const cards = await Card.find({ deck });

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

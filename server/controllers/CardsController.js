const Card = require("../models/Card");

module.exports.getCards = async (req, res, next) => {
  try {
    const { deck } = req.query;

    const cards = await Card.find({ deck });

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

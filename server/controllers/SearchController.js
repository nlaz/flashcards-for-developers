const Joi = require("joi");

const Deck = require("../models/Deck");
const searchSchemas = require("./validation/search");

const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.searchContent = async (req, res, next) => {
  try {
    const { text } = req.query;

    await Joi.validate(req.query, searchSchemas.searchContent);

    const status = { $ne: "private" }; // hide private
    const regex = new RegExp(escapeRegex(text), "gi");
    const query = text !== "*" ? { name: regex, description: regex } : {};

    const decks = await Deck.find({ status, ...query }).limit(10);

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

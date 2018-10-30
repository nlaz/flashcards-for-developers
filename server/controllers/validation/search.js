const Joi = require("joi");

module.exports = {
  searchContent: {
    text: Joi.string().allow(""),
  },
};

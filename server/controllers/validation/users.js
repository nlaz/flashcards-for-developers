const Joi = require("joi");

module.exports = {
  signupUser: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  loginUser: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  githubUser: {
    body: Joi.object().keys({
      code: Joi.string().required(),
    }),
  },
};

const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getConfig, updateConfig } = require("../../controllers/private/config");

router.get(
  "/",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
    }),
  }),
  getConfig
);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      configs: Joi.array().required(),
    }),
  }),
  updateConfig
);

module.exports = router;

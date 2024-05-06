const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { createAgent } = require("../../controllers/private/agents");

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
    }),
  }),
  createAgent
);

module.exports = router;

const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  signIn,
  signUp,
  signOut,
  sendCode,
} = require("../../controllers/public/registration");

router.post(
  "/sign_in",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      code: Joi.string().required(),
      agent_id: Joi.string(),
    }),
  }),
  signIn
);

router.post(
  "/send_code",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
    }),
  }),
  sendCode
);

router.post(
  "/sign_up",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
    }),
  }),
  signUp
);

router.post("/sign_out", signOut);

module.exports = router;

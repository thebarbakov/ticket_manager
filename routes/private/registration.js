const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  signIn,
  signUp,
  signOut,
} = require("../../controllers/private/registration");

router.post(
  "/sign_in",
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  signIn
);

router.post(
  "/sign_up",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30).required(),
      login: Joi.string().min(2).max(30).required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  signUp
);

router.post("/sign_out", signOut);

module.exports = router;

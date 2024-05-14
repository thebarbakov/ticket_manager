const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const { logIn, getOrder, checkTicket } = require("../../controllers/app/app");
const { getMe } = require("../../controllers/private/users");

router.post(
  "/sign_in",
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  logIn
);

router.use(require("./appRestricted"));
module.exports = router;

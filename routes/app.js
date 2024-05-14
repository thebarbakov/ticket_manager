const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const { logIn, getOrder, checkTicket } = require("../controllers/app/app");
const { getMe } = require("../controllers/private/users");

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

router.use(require("../middlewares/app"));

router.get("/me", getMe);

router.post(
  "/ticket/status",
  celebrate({
    body: Joi.object().keys({
      ticket_id: Joi.string().length(24).hex().required(),
      status: Joi.string().required(),
    }),
  }),
  checkTicket
);

router.get("/ticket/:ticket_id", getOrder);
module.exports = router;

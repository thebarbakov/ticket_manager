const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const { logIn, getOrder, checkTicket } = require("../../controllers/app/app");
const { getMe } = require("../../controllers/private/users");

router.use(require("../../middlewares/app"));

router.get("/me", getMe);

router.post(
  "/ticket/status",
  celebrate({
    body: Joi.object().keys({
      ticket_id: Joi.string().length(24).hex().required(),
      status: Joi.boolean().required(),
    }),
  }),
  checkTicket
);

router.get("/ticket/:ticket_id", getOrder);
module.exports = router;

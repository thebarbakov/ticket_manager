const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  preCreateOrder,
  applyPromocode,
  createOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  getTickets
} = require("../../controllers/public/orders");

router.post(
  "/pre_create",
  celebrate({
    body: Joi.object().keys({
      agent_id: Joi.string().length(24).hex().required(),
      places: Joi.array().required(),
      event_id: Joi.string().length(24).hex().required(),
    }),
  }),
  preCreateOrder
);
router.patch(
  "/promocode",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      promocode: Joi.string().required(),
    }),
  }),
  applyPromocode
);
router.post(
  "/confirme",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      pay_type_id: Joi.string().length(24).hex().required(),
    }),
  }),
  createOrder
);
router.get("/", getMyOrders);
router.get("/tickets", getTickets);
router.patch("/:id", cancelOrder);
router.get("/:id", getMyOrder);
module.exports = router;

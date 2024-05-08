const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getOrders,
  getOrder,
  getEventsInfo,
  updateOrder,
  createOrder,
  getCreatonOrderInfo,
  getTickets,
  getOrdersFromEvent,
  getReport
} = require("../../controllers/private/orders");

router.get("/", getOrders);

router.get("/report", getReport);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      agent_id: Joi.string().length(24).hex(),
      promocode: Joi.string(),
      discount: Joi.string().length(24).hex(),
      pay_type_id: Joi.string().length(24).hex().required(),
      first_name: Joi.string(),
      second_name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string(),
      places: Joi.array().required(),
      event_id: Joi.string().length(24).hex().required(),
      status: Joi.string(),
    }),
  }),
  createOrder
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      order_id: Joi.string().length(24).hex().required(),
      agent_id: Joi.string().length(24).hex(),
      promocode: Joi.string(),
      discount: Joi.string().length(24).hex(),
      status: Joi.string(),
      pay_type_id: Joi.string().length(24).hex(),
      is_tickets_sent: Joi.boolean(),
      is_tickets_print: Joi.boolean(),
      is_payed: Joi.boolean(),
      places: Joi.array(),
    }),
  }),
  updateOrder
);

router.get("/events_info", getEventsInfo);
router.get("/tickets", getTickets);
router.get("/creation_info/:event_id", getCreatonOrderInfo);
router.get("/scheme_orders/:event_id", getOrdersFromEvent);

router.get("/:id", getOrder);

module.exports = router;

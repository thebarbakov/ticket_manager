const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getEvents,
  getEvent,
  createEvent,
  getCreatonOrderInfo,
  editEvent,
  deleteEvent,
} = require("../../controllers/private/events");

router.get("/", getEvents);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      hall_id: Joi.string().length(24).hex(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.string().required(),
      image_file: Joi.string(),
      image_file_name: Joi.string(),
      places: Joi.boolean().required(),
      type: Joi.string().required(),
      open_sales: Joi.string(),
      close_sales: Joi.string(),
    }),
  }),
  createEvent
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.string().required(),
      image_file: Joi.string(),
      image_file_name: Joi.string(),
      open_sales: Joi.string(),
      close_sales: Joi.string(),
    }),
  }),
  editEvent
);

router.get("/creation_info", getCreatonOrderInfo);

router.get("/:id", getEvent);

router.delete("/:id", deleteEvent);

module.exports = router;

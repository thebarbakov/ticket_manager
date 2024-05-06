const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getTariffs,
  getTariff,
  getCreatonTariffInfo,
  createTariff,
  editTariff,
  deleteTariff,
} = require("../../controllers/private/tariff");

router.get("/", getTariffs);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      event_id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      description: Joi.string(),
      limit: Joi.number().required(),
      is_on_limit: Joi.boolean().required(),
      price: Joi.number().required(),
    }),
  }),
  createTariff
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),

      name: Joi.string().required(),
      description: Joi.string(),
      limit: Joi.number().required(),
      is_on_limit: Joi.boolean().required(),
      price: Joi.number().required(),
    }),
  }),
  editTariff
);

router.get("/creation_info", getCreatonTariffInfo);

router.get("/:id", getTariff);

router.delete("/:id", deleteTariff);

module.exports = router;

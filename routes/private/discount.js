const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getDiscount,
  getDiscounts,
  createDiscount,
  editDiscount,
  deleteDiscount,
  getCreationInfo,
} = require("../../controllers/private/discounts");

router.get("/", getDiscounts);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      publicName: Joi.string().required(),
      is_on: Joi.boolean().required(),
      limit_is_active: Joi.boolean().required(),
      limit: Joi.number(),
      tariff_available: Joi.array(),
      places_tariff_available: Joi.array(),
      promocode: Joi.string(),
      summa: Joi.number(),
      percent: Joi.number(),
      max_summa: Joi.number(),
      min_summa: Joi.number(),
      max_places: Joi.number(),
      condition_min_summa: Joi.number(),
      condition_max_summa: Joi.number(),
      condition_min_places: Joi.number(),
      condition_max_places: Joi.number(),
    }),
  }),
  createDiscount
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      publicName: Joi.string().required(),
      is_on: Joi.boolean().required(),
      limit_is_active: Joi.boolean().required(),
      limit: Joi.number(),
      tariff_available: Joi.array(),
      places_tariff_available: Joi.array(),
      promocode: Joi.string(),
      summa: Joi.number(),
      percent: Joi.number(),
      max_summa: Joi.number(),
      min_summa: Joi.number(),
      max_places: Joi.number(),
      condition_min_summa: Joi.number(),
      condition_max_summa: Joi.number(),
      condition_min_places: Joi.number(),
      condition_max_places: Joi.number(),
    }),
  }),
  editDiscount
);

router.get("/creation_info", getCreationInfo);

router.get("/:id", getDiscount);

router.delete("/:id", deleteDiscount);

module.exports = router;

const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getPlacesTariffs,
  getPlacesTariff,
  getCreatonTariffInfo,
  createPlacesTariff,
  editPlacesTariff,
  deletePlacesTariff,
} = require("../../controllers/private/placesTariff");

router.get("/", getPlacesTariffs);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      event_id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      places: Joi.array(),
      color: Joi.string(),
    }),
  }),
  createPlacesTariff
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),

      event_id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      places: Joi.array(),
      color: Joi.string(),
    }),
  }),
  editPlacesTariff
);

router.get("/creation_info", getCreatonTariffInfo);

router.get("/:id", getPlacesTariff);

router.delete("/:id", deletePlacesTariff);

module.exports = router;

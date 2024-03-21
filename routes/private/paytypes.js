const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getPayTypes,
  getPayType,
  createPayType,
  editPayType,
  deletePayType,
} = require("../../controllers/private/payType");

router.get("/", getPayTypes);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      is_active: Joi.boolean().required(),

      name: Joi.string().required(),
      description: Joi.string().required(),

      is_public: Joi.boolean().required(),
    }),
  }),
  createPayType
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),

      is_active: Joi.boolean().required(),

      name: Joi.string().required(),
      description: Joi.string().required(),

      is_public: Joi.boolean().required(),
    }),
  }),
  editPayType
);

router.get("/:id", getPayType);

router.delete("/:id", deletePayType);

module.exports = router;

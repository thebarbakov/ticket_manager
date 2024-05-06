const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getHalls,
  preCreateHall,
  getHall,
  createHall,
  editHall,
  deleteHall,
} = require("../../controllers/private/halls");

router.get("/", getHalls);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      address: Joi.string(),
      scheme_file: Joi.string(),
      scheme_file_name: Joi.string(),
      file_name: Joi.string(),
    }),
  }),
  createHall
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      name: Joi.string().required(),
      address: Joi.string(),
    }),
  }),
  editHall
);

router.put(
  "/analyze_scheme",
  celebrate({
    body: Joi.object().keys({
      scheme_file: Joi.string().required(),
      scheme_file_name: Joi.string().required(),
    }),
  }),
  preCreateHall
);

router.get("/:id", getHall);

router.delete("/:id", deleteHall);

module.exports = router;

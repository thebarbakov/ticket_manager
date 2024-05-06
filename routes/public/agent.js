const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const { getMe, editMe } = require("../../controllers/public/agent");

router.get("/me", getMe);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30),
      second_name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
      phone: Joi.string(),
    }),
  }),
  editMe
);
module.exports = router;

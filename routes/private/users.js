const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
  getMe,
  editMe,
} = require("../../controllers/private/users");

router.get("/", getUsers);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      is_active: Joi.boolean().required(),

      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30).required(),

      email: Joi.string().required().email(),
      login: Joi.string().required(),

      password: Joi.string().required(),

      access: Joi.required(),
    }),
  }),
  createUser
);
router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      login: Joi.string().required().email(),
      password: Joi.string(),
      access: Joi.required(),
      is_active: Joi.boolean().required(),
    }),
  }),
  editUser
);
router.get("/me", getMe);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().min(2).max(30).required(),
      second_name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      login: Joi.string().required().email(),
      password: Joi.string(),
    }),
  }),
  editMe
);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);

module.exports = router;

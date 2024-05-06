const router = require("express").Router();

const { celebrate, Joi } = require("celebrate");

const { getEvents, getEvent } = require("../../controllers/public/events");

router.get("/", getEvents);

router.get("/:id", getEvent);

module.exports = router;

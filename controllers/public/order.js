const { Router } = require("express");
const NotFound = require("../../errors/NotFound");
const Hall = require("../../models/Hall");
const Tariff = require("../../models/Tariff");
const Discount = require("../../models/Discount");
const OrderPlaces = require("../../models/OrderPlaces");
const CastError = require("../../errors/CastError");

// /api/groups

const getOrder = async (req, res, next) => {
  try {
    return res.status(200).json({});
  } catch (e) {
    return next(e);
  }
};

const calculateOrder = async (req, res, next) => {
  try {
    const { event_id, places, promocode, order_id } = req.body;



    return res.status(200).json({ events });
  } catch (e) {
    return next(e);
  }
};

const bookOrder = async (req, res, next) => {
  try {
    const { event_id } = req.query;

    const event = await Event.findOne({ event_id });

    if (!event) return next(new NotFound("Мероприятие не найдено"));

    const hall = await Hall.findOne({ _id: event.hall_id });

    const response = { hall, event };

    if (event.places)
      response.scheme = JSON.parse(
        fs.readFileSync(`./assets/halls_schemes/${hall.scheme}`, "utf8")
      );

    if (event.type === "tariff")
      response.tariff = await Tariff.find({ event_id });
    else if (event.type === "places")
      response.places_tariff = await PlacesTariff.find({ event_id });

    return res.status(200).json(response);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  createOrder,
  bookOrder,
};

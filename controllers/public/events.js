const { Router } = require("express");
const NotFound = require("../../errors/NotFound");
const Hall = require("../../models/Hall");
const Place = require("../../models/Place");
const Tariff = require("../../models/Tariff");
const PlacesTariff = require("../../models/PlacesTariff");
const Event = require("../../models/Event");
const getHallEventScheme = require("../../utils/getHallEventScheme");

// /api/groups

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      close_sales: { $gt: new Date() },
      date: { $gt: new Date() },
    });

    const halls = await Hall.find(
      {},
      {
        name: 1,
        address: 1,
      }
    );

    return res.status(200).json({ events, halls });
  } catch (e) {
    return next(e);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ event_id: id });

    if (!event) return next(new NotFound("Мероприятие не найдено"));

    // const hall = await Hall.findOne({ _id: event.hall_id });

    // const response = { hall, event };

    response = await getHallEventScheme({
      event_id: id,
    });

    // if (event.places)
    //   response.places = await Place.find({ hall_id: event.hall_id });

    // if (event.type === "tariff")
    //   response.tariff = await Tariff.find({ event_id: id });
    // else if (event.type === "places")
    //   response.places_tariff = await PlacesTariff.find({ event_id: id });

    return res.status(200).json(response);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getEvents,
  getEvent,
};

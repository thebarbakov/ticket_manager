const { Router } = require("express");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../../errors/ForbiddenError");
const CastError = require("../../errors/CastError");
const Hall = require("../../models/Hall");
const Place = require("../../models/Place");
const generateHall = require("../../utils/generateHall");
const PlacesTariff = require("../../models/PlacesTariff");
const getHallEventScheme = require("../../utils/getHallEventScheme");
const Event = require("../../models/Event");

// /api/groups

const getPlacesTariffs = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.name !== undefined) {
      filter.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.event_id !== undefined) {
      filter.event_id = req.query.event_id;
    }
    if (req.query.hall_id !== undefined) {
      filter.hall_id = req.query.hall_id;
    }
    if (req.query.price !== undefined) {
      filter.price = req.query.price;
    }

    const places_tariffs = await PlacesTariff.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const totalDocs = await PlacesTariff.find(filter).countDocuments();
    const events = await Event.find({}, { _id: 1, name: 1, date: 1 });
    const halls = await Hall.find({}, { _id: 1, name: 1, address: 1 });
    return res
      .status(200)
      .json({
        places_tariffs,
        events,
        halls,
        totalDocs,
        currentPage: req.query.p,
      });
  } catch (e) {
    return next(e);
  }
};

const getPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const places_tariff = await PlacesTariff.findOne({ _id: req.params.id });
    const events = await Event.find(
      { _id: places_tariff.event_id },
      { _id: 1, name: 1, date: 1 }
    );
    const hall = await getHallEventScheme({ event_id: events[0]._id });
    return res.status(200).json({ places_tariff, events, hall });
  } catch (e) {
    return next(e);
  }
};

const getCreatonTariffInfo = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const events = await Event.find(
      { type: "places" },
      { _id: 1, name: 1, date: 1 }
    );
    return res.status(200).json({ events });
  } catch (e) {
    return next(e);
  }
};

const createPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { event_id, name, price, places, color } = req.body;

    const event = await Event.findOne({ _id: event_id });

    if (!event) return next(new CastError("Неверное id мероприятия"));

    const selectedPlaces = await PlacesTariff.find({
      places: { $elemMatch: { $elemMatch: { $in: places } } },
    });

    if (selectedPlaces.length !== 0)
      return next(new CastError("Место уже находится в другом тарифе"));

    let newPlacesTariff = new PlacesTariff({
      hall_id: event.hall_id,
      event_id,
      name,
      price,
      places,
      color,
    });

    newPlacesTariff = await newPlacesTariff.save();

    const hall = await getHallEventScheme({ event_id: event._id });

    return res.status(200).json({
      places_tariff: newPlacesTariff,
      hall,
    });
  } catch (e) {
    return next(e);
  }
};

const editPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { _id, name, price, color, places } = req.body;

    await PlacesTariff.findOneAndUpdate(
      { _id },
      { name, price, color, places }
    );

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deletePlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await PlacesTariff.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getPlacesTariffs,
  getPlacesTariff,
  getCreatonTariffInfo,
  createPlacesTariff,
  editPlacesTariff,
  deletePlacesTariff,
};

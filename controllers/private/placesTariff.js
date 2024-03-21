const { Router } = require("express");
const fs = require("node:fs");
const Favorite = require("../models/Favorite");
const User = require("../../models/User");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../errors/ForbiddenError");
const CastError = require("../errors/CastError");
const Hall = require("../../models/Hall");
const Place = require("../../models/Place");
const generateHall = require("../../utils/generateHall");
const PlaceTariff = require("../../models/PlaceTariff");
const PlacesTariff = require("../../models/PlacesTariff");

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

    const places_tariffs = await PlaceTariff.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const events = await Event.find({}, { _id: 1, name: 1, date: 1 });
    const halls = await Hall.find({}, { _id: 1, name: 1, address: 1 });
    return res.status(200).json({ places_tariffs, events, halls });
  } catch (e) {
    return next(e);
  }
};

const getPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const places_tariff = await PlaceTariff.findOne({ _id: req.params.id });
    const events = await Event.find(
      { _id: places_tariff.event_id },
      { _id: 1, name: 1, date: 1 }
    );
    const halls = await Hall.find(
      { _id: places_tariff.hall_id },
      { _id: 1, name: 1, address: 1 }
    );
    const places = await Place.find({ hall_id: places_tariff.hall_id });
    const tariff_in_hall = await PlaceTariff.find({
      event_id: places_tariff.event_id,
      hall_id: places_tariff.hall_id,
    });
    return res
      .status(200)
      .json({ places_tariff, events, halls, places, tariff_in_hall });
  } catch (e) {
    return next(e);
  }
};

const getCreatonTariffInfo = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { event_id, hall_id } = req.body;
    const events = await Event.find(
      { _id: event_id },
      { _id: 1, name: 1, date: 1 }
    );
    const halls = await Hall.find(
      { _id: hall_id },
      { _id: 1, name: 1, address: 1 }
    );
    const places = await Place.find({ hall_id: hall_id });
    const tariff_in_hall = await PlaceTariff.find({
      event_id,
      hall_id,
    });
    return res.status(200).json({ events, halls, places, tariff_in_hall });
  } catch (e) {
    return next(e);
  }
};

const createPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { hall_id, event_id, name, price, places, color } = req.body;

    const event = await Event.findOne({ _id: event_id });

    if (!event) return next(new CastError("Неверное id мероприятия"));

    const hall = await Hall.findOne({ _id: hall_id });

    if (!hall) return next(new CastError("Неверное id холла"));

    const selectedPlaces = await PlacesTariff.find({
      places: { $elemMatch: { $elemMatch: { $in: places } } },
    });

    if (selectedPlaces.length !== 0)
      return next(new CastError("Место уже находится в другом тарифе"));

    let newPlacesTariff = new PlaceTariff({
      hall_id,
      event_id,
      name,
      price,
      places,
      color,
    });

    newPlacesTariff = await newPlacesTariff.save();

    return res.status(200).json({ places_tariff: newPlacesTariff });
  } catch (e) {
    return next(e);
  }
};

const editPlacesTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { places_tariff_id, name, price, color } = req.body;

    await PlacesTariff.findOneAndUpdate(
      { _id: places_tariff_id },
      { name, price, color }
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

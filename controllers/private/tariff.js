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
const Tariff = require("../../models/Tariff");

// /api/groups

const getTariffs = async (req, res, next) => {
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

    if (req.query.price !== undefined) {
      filter.price = req.query.price;
    }

    const tariffs = await Tariff.find(filter)
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
    return res.status(200).json({ tariffs, events });
  } catch (e) {
    return next(e);
  }
};

const getTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const tariff = await Tariff.findOne({ _id: req.params.id });
    const events = await Event.findOne({ _id: tariff.event_id });
    return res.status(200).json({ tariff, events });
  } catch (e) {
    return next(e);
  }
};

const getCreatonTariffInfo = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const events = await Event.find({}, { name: 1, _id: 1, date: 1 });

    return res.status(200).json({ events });
  } catch (e) {
    return next(e);
  }
};

const createTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { event_id, name, description, limit, is_on_limit, price } = req.body;

    const event = await Event.findOne({ _id: event_id });

    if (!event) return next(new CastError("Неверное id мероприятия"));

    let newTariff = new Tariff({
      event_id,
      name,
      description,
      limit,
      is_on_limit,
      price,
    });

    newTariff = await newTariff.save();

    return res.status(200).json({ new_tariff: newTariff });
  } catch (e) {
    return next(e);
  }
};

const editTariff = async (req, res, next) => {
  try {
    if (req.user.access.tariff !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { tariff_id, name, description, limit, is_on_limit, price } =
      req.body;

    await Tariff.findOneAndUpdate(
      { _id: tariff_id },
      { name, description, limit, is_on_limit, price }
    );

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deleteTariff = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await Tariff.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getTariffs,
  getTariff,
  getCreatonTariffInfo,
  createTariff,
  editTariff,
  deleteTariff,
};

const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const User = require("../../models/User");
const generateRandomString = require("../../utils/generateRandomString");
const Discount = require("../../models/Discount");
const CastError = require("../../errors/CastError");
const Tariff = require("../../models/Tariff");
const PlacesTariff = require("../../models/PlacesTariff");

const todayFrom = (date) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  return today;
};
const todayTo = (date) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() + 1);
  return today;
};

const getDiscounts = async (req, res, next) => {
  try {
    if (req.user.access.discounts !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.name !== undefined) {
      filter.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.promocode !== undefined) {
      filter.promocode = { $regex: new RegExp(req.query.promocode, "i") };
    }
    if (req.query.publicName !== undefined) {
      filter.publicName = { $regex: new RegExp(req.query.publicName, "i") };
    }
    if (req.query.is_on !== undefined) {
      filter.is_on = req.query.is_on;
    }

    const discounts = await Discount.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const totalDocs = await Discount.find(filter).countDocuments();

    return res
      .status(200)
      .json({ discounts, totalDocs, currentPage: req.query.p });
  } catch (e) {
    return next(e);
  }
};

const getCreationInfo = async (req, res, next) => {
  try {
    if (req.user.access.discounts !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const tariffs = await Tariff.find();
    const tariffs_places = await PlacesTariff.find();
    return res.status(200).json({ tariffs, tariffs_places });
  } catch (e) {
    return next(e);
  }
};

const getDiscount = async (req, res, next) => {
  try {
    if (req.user.access.discounts !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const tariffs = await Tariff.find();
    const tariffs_places = await PlacesTariff.find();
    const discount = await Discount.findOne({ _id: req.params.id });
    return res.status(200).json({ discount, tariffs, tariffs_places });
  } catch (e) {
    return next(e);
  }
};

const createDiscount = async (req, res, next) => {
  try {
    if (req.user.access.discounts !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      name,
      publicName,
      is_on,
      limit_is_active,
      limit,
      tariff_available,
      places_tariff_available,
      promocode,
      summa,
      percent,
      max_summa,
      min_summa,
      max_places,
      condition_min_summa,
      condition_max_summa,
      condition_min_places,
      condition_max_places,
    } = req.body;

    if (Boolean(summa) & Boolean(percent))
      return next(
        new CastError(
          "Нельзя одновременно применять и абсолюьное и отсносительное значение"
        )
      );

    let newDiscount = new Discount({
      name,
      publicName,
      is_on,
      limit_is_active,
      limit,
      tariff_available,
      places_tariff_available,
      promocode,
      summa,
      percent,
      max_summa,
      min_summa,
      max_places,
      condition_min_summa,
      condition_max_summa,
      condition_min_places,
      condition_max_places,
    });

    newDiscount = await newDiscount.save();

    return res.status(200).json({ discount: newDiscount });
  } catch (e) {
    return next(e);
  }
};

const editDiscount = async (req, res, next) => {
  try {
    if (req.user.access.discounts !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      _id,
      name,
      publicName,
      is_on,
      limit_is_active,
      limit,
      tariff_available,
      places_tariff_available,
      promocode,
      summa,
      percent,
      max_summa,
      min_summa,
      max_places,
      condition_min_summa,
      condition_max_summa,
      condition_min_places,
      condition_max_places,
    } = req.body;

    if (Boolean(summa) & Boolean(percent))
      return next(
        new CastError(
          "Нельзя одновременно применять и абсолюьное и отсносительное значение"
        )
      );

    await Discount.findOneAndUpdate(
      { _id },
      {
        name,
        publicName,
        is_on,
        limit_is_active,
        limit,
        tariff_available,
        places_tariff_available,
        promocode,
        summa,
        percent,
        max_summa,
        min_summa,
        max_places,
        condition_min_summa,
        condition_max_summa,
        condition_min_places,
        condition_max_places,
      }
    );

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await Discount.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getDiscount,
  getDiscounts,
  createDiscount,
  editDiscount,
  deleteDiscount,
  getCreationInfo,
};

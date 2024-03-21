const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const User = require("../../models/User");
const generateRandomString = require("../../utils/generateRandomString");
const PayType = require("../../models/PayType");

const getPayTypes = async (req, res, next) => {
  try {
    if (req.user.access.pay_types !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.name !== undefined) {
      filter.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.description !== undefined) {
      filter.description = { $regex: new RegExp(req.query.description, "i") };
    }
    if (req.query.is_active !== undefined) {
      filter.description = { $regex: new RegExp(req.query.is_active, "i") };
    }
    if (req.query.is_public !== undefined) {
      filter.is_public = { $regex: new RegExp(req.query.is_public, "i") };
    }

    const pay_types = await PayType.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    return res.status(200).json({ pay_types });
  } catch (e) {
    return next(e);
  }
};

const getPayType = async (req, res, next) => {
  try {
    if (req.user.access.pay_types !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const pay_type = await PayType.findOne({ _id: req.params.id });
    return res.status(200).json({ pay_type });
  } catch (e) {
    return next(e);
  }
};

const createPayType = async (req, res, next) => {
  try {
    if (req.user.access.pay_types !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { is_active, name, description, is_public } = req.body;

    let newPayType = new PayType({ is_active, name, description, is_public });

    newPayType = await newPayType.save();

    return res.status(200).json({ pay_type: newPayType });
  } catch (e) {
    return next(e);
  }
};

const editPayType = async (req, res, next) => {
  try {
    if (req.user.access.pay_types !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { is_active, name, description, is_public, _id } = req.body;

    await PayType.editOne({ _id }, { is_active, name, description, is_public });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deletePayType = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await PayType.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getPayTypes,
  getPayType,
  createPayType,
  editPayType,
  deletePayType,
};

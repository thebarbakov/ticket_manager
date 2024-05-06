const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const Config = require("../../models/Config");

const getConfig = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const config = await Config.find();

    return res.status(200).json({ config });
  } catch (e) {
    return next(e);
  }
};

const updateConfig = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { configs } = req.body;

    for await (const cog of configs) {
      await Config.updateOne({ key: cog.key }, { value: cog.value });
    }

    return res.status(200).json({ status: "ok" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getConfig,
  updateConfig,
};

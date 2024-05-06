const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const Agent = require("../../models/Agent");

const createAgent = async (req, res, next) => {
  try {
    if (req.user.access.agents !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { first_name, second_name, email, phone } = req.body;

    let newAgent = new Agent({ first_name, second_name, email, phone });

    const agent = await newAgent.save();

    return res.status(200).json({ agent });
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError("Пользователь уже существует"));
    }
    return next(e);
  }
};

module.exports = {
  createAgent,
};

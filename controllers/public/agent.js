const { Router } = require("express");
const ConflictError = require("../../errors/ConflictError");
const Agent = require("../../models/Agent");

const getMe = async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ _id: req.agent._id });

    return res.status(200).json({ agent });
  } catch (e) {
    return next(e);
  }
};

const editMe = async (req, res, next) => {
  try {
    const { first_name, second_name, email, phone } = req.body;

    const candidate = await Agent.find({ email, _id: { $ne: req.agent._id } });

    if (candidate.length !== 0)
      return next(new ConflictError("Email уже используется"));

    await Agent.updateOne(
      { _id: req.agent._id },
      { first_name, second_name, email, phone }
    );

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMe,
  editMe,
};

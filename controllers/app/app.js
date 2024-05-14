const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const User = require("../../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const OrderPlaces = require("../../models/OrderPlaces");
const Order = require("../../models/Order");
const CastError = require("../../errors/CastError");
const Event = require("../../models/Event");
const Hall = require("../../models/Hall");
const Discount = require("../../models/Discount");
const Place = require("../../models/Place");
const Agent = require("../../models/Agent");

const { JWT_SECRET } = process.env;

const logIn = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login }, "+password");

    if (!user) {
      return next(new UnauthorizedError("Неправильная почта или пароль"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new UnauthorizedError("Неправильная почта или пароль"));
    }

    const token = jwt.sign({ user_id: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    delete user.password;

    return res.status(200).json({ status: "ok!", user, token });
  } catch (e) {
    return next(e);
  }
};

const getOrder = async (req, res, next) => {
  try {
    if (req.user.access.scanner !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { ticket_id } = req.params;

    const order_place = await OrderPlaces.findOne({ _id: ticket_id });

    const order = await Order.findOne({
      _id: order_place.order_id,
      status: "confirmed",
      is_payed: true,
    });

    if (!order) return next(new CastError("Заказ не найден"));

    const order_places = await OrderPlaces.find({
      order_id: order_place.order_id,
    });
    const place = await Place.findOne({ _id: order_place.place_id });
    const event = await Event.findOne({ _id: order.event_id });
    const hall = await Hall.findOne({ _ID: event.hall_id });
    const discount = await Discount.findOne({ _id: order.discount });
    const agent = await Agent.findOne({ _id: order.agent_id });

    return res.status(200).json({
      order_place: { ...order_place._doc, place },
      order: {
        ...order._doc,
        order_places,
        event,
        hall,
        discount_item: discount,
        agent,
      },
    });
  } catch (e) {
    return next(e);
  }
};

const checkTicket = async (req, res, next) => {
  try {
    if (req.user.access.scanner !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { ticket_id, status } = req.body;

    const order_place = await OrderPlaces.findOne({ _id: ticket_id });
    const order = await Order.findOne({
      _id: order_place.order_id,
      status: "confirmed",
      is_payed: true,
    });

    if (!order) return next(new CastError("Заказ не найден"));

    if (order_place.status === status)
      return next(new CastError("Билет уже в этом статусе"));

    await OrderPlaces.updateOne(
      {
        _id: ticket_id,
      },
      { is_entered: status, is_scanned: true }
    );

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  logIn,
  getOrder,
  checkTicket,
};

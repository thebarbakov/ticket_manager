const { Router } = require("express");
const Favorite = require("../models/Favorite");
const User = require("../../models/User");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../errors/ForbiddenError");
const CastError = require("../errors/CastError");

const Order = require("../../models/Order");
const Discount = require("../../models/Discount");
const PayType = require("../../models/PayType");
const Agent = require("../../models/Agent");
const getHallEventScheme = require("../../utils/getHallEventScheme");
const OrderPlaces = require("../../models/OrderPlaces");
const Place = require("../../models/Place");

const OrderClass = require("../../utils/Order");

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

// /api/groups

const getOrders = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.event_id !== undefined) {
      filter.event_id = req.query.event_id;
    }
    if (req.query.agent_id !== undefined) {
      filter.agent_id = req.query.agent_id;
    }
    if (req.query.discount !== undefined) {
      filter.discount = req.query.discount;
    }
    if (req.query.total_sum !== undefined) {
      filter.total_sum = req.query.total_sum;
    }
    if (req.query.status !== undefined) {
      filter.status = req.query.status;
    }
    if (req.query.pay_type_id !== undefined) {
      filter.pay_type_id = req.query.pay_type_id;
    }
    if (req.query.is_payed !== undefined) {
      filter.is_payed = req.query.is_payed;
    }
    if (req.query.is_tickets_sent !== undefined) {
      filter.is_tickets_sent = req.query.is_tickets_sent;
    }
    if (
      (req.query.f_created_date !== undefined) &
      (req.query.t_created_date !== undefined)
    ) {
      filter.date = {
        $gte: todayFrom(req.query.created_date),
        $lt: todayTo(req.query.created_date),
      };
    }
    if (
      (req.query.f_created_date === undefined) &
      (req.query.t_created_date !== undefined)
    ) {
      filter.date = { $lt: todayTo(req.query.created_date) };
    }
    if (
      (req.query.f_created_date !== undefined) &
      (req.query.t_created_date === undefined)
    ) {
      filter.date = { $gte: todayFrom(req.query.created_date) };
    }

    const orders = await Order.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );

    const discounts = await Discount.find(
      {},
      { _id: 1, name: 1, publicName: 1 }
    );
    const events = await Event.find({}, { _id: 1, name: 1, date: 1 });
    const pay_types = await PayType.find({}, { _id: 1, name: 1 });
    const users = await User.find({});
    const agents = await Agent.find(
      {},
      { _id: 1, first_name: 1, second_name: 1, email: 1 }
    );
    return res
      .status(200)
      .json({ orders, discounts, events, pay_types, agents, users });
  } catch (e) {
    return next(e);
  }
};

const getOrder = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const order = await Order.findOne({ _id: req.params.id });
    const order_places = await OrderPlaces.findOne({ order_id: req.params.id });
    const event = await Event.findOne({ _id: order.event_id });
    const users = await User.find({});
    const discounts = await Discount.find({});
    const pay_types = await PayType.find({}, { _id: 1, name: 1 });
    const agents = await Agent.find({});
    const places = await Place.find({});

    return res.status(200).json({
      order,
      order_places,
      places,
      discounts,
      event,
      pay_types,
      agents,
      users,
    });
  } catch (e) {
    return next(e);
  }
};

const getEventsInfo = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const events = await Event.find({ date: {$lte: new Date()} });
    const halls = await Hall.find({});

    return res
      .status(200)
      .json({ events, halls });
  } catch (e) {
    return next(e);
  }
};

const getCreatonOrderInfo = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const events = await Event.findOne({ _id: req.params.event_id });
    const discounts = await Discount.find({});
    const pay_types = await PayType.find({}, { _id: 1, name: 1 });
    const agents = await Agent.find(
      {},
      { first_name: 1, second_name: 1, email: 1, phone: 1, _id: 1 }
    );

    const hall_scheme = await getHallEventScheme({
      show_order: 1,
      event_id: req.params.event_id,
    });

    return res
      .status(200)
      .json({ discounts, events, pay_types, agents, hall_scheme });
  } catch (e) {
    return next(e);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const {
      agent_id,
      promocode,
      discount,
      pay_type_id,
      first_name,
      second_name,
      phone,
      email,
      places,
      event_id,
      status,
    } = req.body;

    const editedOrder = new OrderClass({
      promocode,
      discount,
      pay_type_id,
      agent_id,
      first_name,
      second_name,
      phone,
      email,
      places,
      event_id,
      status,
    });

    await editedOrder.init();

    return res.status(200).json({ order: this.order });
  } catch (e) {
    return next(e);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      order_id,
      agent_id,
      discount,
      status,
      pay_type_id,
      is_tickets_sent,
      is_tickets_print,
      is_payed,
      places: newPlaces,
    } = req.body;

    const result = {};

    if (Boolean(discount) || Boolean(newPlaces)) {
      const editedOrder = new OrderClass({ order_id: order_id });
      await editedOrder.init();
      const { order, places } = await editedOrder.update({
        discount,
        places: newPlaces,
        user_id: req.user._id,
      });
      result.order = order;
      result.places = places;
    } else {
      result.status = "ok!";
      if (agent_id) {
        await Order.updateOne(
          { _id: order_id },
          {
            agent_id,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text: "В заказе изменен клиент",
              },
            },
          }
        );
      } else if (status) {
        await Order.updateOne(
          { _id: order_id },
          {
            status,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text: "В заказе изменен статус на " + status,
              },
            },
          }
        );
      } else if (pay_type_id) {
        await Order.updateOne(
          { _id: order_id },
          {
            pay_type_id,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text: "В заказе изменен тип оплаты на " + pay_type_id,
              },
            },
          }
        );
      } else if (is_tickets_sent) {
        await Order.updateOne(
          { _id: order_id },
          {
            is_tickets_print,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text:
                  "В заказе был изменен флаг отправки билетов на " +
                  is_tickets_print,
              },
            },
          }
        );
      } else if (is_tickets_print) {
        await Order.updateOne(
          { _id: order_id },
          {
            is_tickets_print,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text:
                  "В заказе был изменен флаг печати билетов на " +
                  is_tickets_print,
              },
            },
          }
        );
      } else if (is_payed) {
        if (req.user.access.set_pay_status !== true)
          return next(new ForbiddenError("Недостаточно прав"));
        await Order.updateOne(
          { _id: order_id },
          {
            is_tickets_sent,
            $push: {
              history: {
                user: req.user._id,
                date: new Date(),
                text: "В заказе изменен флаг оплаты на  " + is_tickets_sent,
              },
            },
          }
        );
      }
    }

    return res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getOrders,
  getOrder,
  getEventsInfo,
  updateOrder,
  createOrder,
  getCreatonOrderInfo,
};

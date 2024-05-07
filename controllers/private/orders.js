const { Router } = require("express");
const User = require("../../models/User");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../../errors/ForbiddenError");

const Order = require("../../models/Order");
const Discount = require("../../models/Discount");
const PayType = require("../../models/PayType");
const Agent = require("../../models/Agent");
const getHallEventScheme = require("../../utils/getHallEventScheme");
const OrderPlaces = require("../../models/OrderPlaces");
const Place = require("../../models/Place");

const OrderClass = require("../../utils/Order");
const Hall = require("../../models/Hall");
const Event = require("../../models/Event");
const Tariff = require("../../models/Tariff");
const sendOrderChangeStatus = require("../../utils/mail/sendOrderChangeStatus");
const generateTicket = require("../../utils/generateTicket");
const sendTicket = require("../../utils/mail/sendTicket");
const PlacesTariff = require("../../models/PlacesTariff");

const { SYSTEM_URL } = process.env;

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
    if (
      (req.query.agent_first_name !== undefined) &
      (req.query.agent_second_name !== undefined)
    ) {
      const agentFilter = {};
      if (req.query.agent_first_name !== undefined) {
        agentFilter.first_name = {
          $regex: new RegExp(req.query.agent_first_name, "i"),
        };
      }
      if (req.query.agent_second_name !== undefined) {
        agentFilter.second_name = {
          $regex: new RegExp(req.query.agent_second_name, "i"),
        };
      }
      const agentsFiltered = await Agent.find(agentFilter);
      filter.agent_id = { $in: agentsFiltered.map((el) => el._id) };
    }

    const orders = await Order.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : -1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const totalDocs = await Order.find(filter).countDocuments();

    const events = await Event.find({}, { _id: 1, name: 1, date: 1 });
    const pay_types = await PayType.find({}, { _id: 1, name: 1 });
    const agents = await Agent.find(
      {},
      { _id: 1, first_name: 1, second_name: 1, email: 1 }
    );
    return res.status(200).json({
      orders,
      events,
      pay_types,
      agents,
      totalDocs,
      currentPage: req.query.p,
    });
  } catch (e) {
    return next(e);
  }
};

const getOrder = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const order = await Order.findOne({ _id: req.params.id });

    if (!order) return next(new NotFoundError("Заказ не найден"));
    const places = await OrderPlaces.find({ order_id: order._id });

    const event = await Event.findOne({ _id: order.event_id });
    const pay_type = await PayType.findOne({ _id: order.pay_type_id });
    const hall = await Hall.findOne({ _id: event.hall_id });
    const placesResult = [];

    for await (const { _doc } of places) {
      let tariff;
      if (event.type === "places") {
        tariff = await PlacesTariff.findOne({ _id: _doc.places_tariff_id });
      } else {
        tariff = await Tariff.findOne({ _id: _doc.tariff_id });
      }

      if (event.places) {
        let place = await Place.findOne({ _id: _doc.place_id });
        placesResult.push({
          ..._doc,
          tariff,
          place,
        });
      } else {
        placesResult.push({
          ..._doc,
          tariff,
        });
      }
    }

    return res.status(200).json({
      order: { ...order._doc, event, pay_type, hall },
      places: placesResult,
    });
  } catch (e) {
    return next(e);
  }
};

const getEventsInfo = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const events = await Event.find({ date: { $gte: new Date() } });
    const halls = await Hall.find({});

    return res.status(200).json({ events, halls });
  } catch (e) {
    return next(e);
  }
};

const getCreatonOrderInfo = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const event = await Event.findOne({ _id: req.params.event_id });
    const pay_types = await PayType.find(
      { is_active: true },
      { _id: 1, name: 1 }
    );
    const agents = await Agent.find(
      {},
      { first_name: 1, second_name: 1, email: 1, phone: 1, _id: 1 }
    );

    const hall_scheme = await getHallEventScheme({
      show_order: 1,
      event_id: event._id,
    });

    return res.status(200).json({ event, pay_types, agents, hall_scheme });
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
      status: status ? status : "booked",
    });

    const result = await editedOrder.init();

    await sendOrderConfirmed({ order_id: result.order._id });

    return res.status(200).json(result);
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
      promocode,
      status,
      pay_type_id,
      is_tickets_sent,
      is_tickets_print,
      is_payed,
      places,
    } = req.body;

    if (Boolean(discount) || Boolean(places) || Boolean(promocode)) {
      const editedOrder = new OrderClass({ order_id: order_id });
      await editedOrder.init();
      await editedOrder.update({
        discount,
        promocode,
        places: places,
        user_id: req.user._id,
      });
    }
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
    }
    if (status) {
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
    }
    if (pay_type_id) {
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
    }
    if ((is_tickets_print !== undefined) & (is_tickets_print !== null)) {
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
    }
    if ((is_payed !== undefined) & (is_payed !== null)) {
      if (req.user.access.set_pay_status !== true)
        return next(new ForbiddenError("Недостаточно прав"));
      await Order.updateOne(
        { _id: order_id },
        {
          is_payed,
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

    if ((is_payed !== undefined) & (is_payed !== null) || Boolean(status)) {
      const order = await Order.findOne({ _id: order_id });
      const agent = await Agent.findOne({ _id: order.agent_id });

      await sendOrderChangeStatus({
        agent,
        order,
        link: `${SYSTEM_URL}/profile/orders/${order._id}`,
      });
    }

    if (Boolean(promocode) || Boolean(pay_type_id)) {
      await sendOrderConfirmed({ order_id: order_id });
    }

    const order = await Order.findOne({ _id: order_id });

    const placesRes = await OrderPlaces.find({ order_id: order._id });

    const event = await Event.findOne({ _id: order.event_id });
    const pay_type = await PayType.findOne({ _id: order.pay_type_id });
    const hall = await Hall.findOne({ _id: event.hall_id });
    const placesResult = [];

    for await (const { _doc } of placesRes) {
      let tariff;
      if (event.type === "places") {
        tariff = await PlacesTariff.findOne({ _id: _doc.places_tariff_id });
      } else {
        tariff = await Tariff.findOne({ _id: _doc.tariff_id });
      }

      if (event.places) {
        let place = await Place.findOne({ _id: _doc.place_id });
        placesResult.push({
          ..._doc,
          tariff,
          place,
        });
      } else {
        placesResult.push({
          ..._doc,
          tariff,
        });
      }
    }

    return res.status(200).json({
      order: { ...order._doc, event, pay_type, hall },
      places: placesResult,
    });
  } catch (e) {
    return next(e);
  }
};

const getTickets = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const { order_id, type } = req.query;

    const order = await Order.findOne({
      _id: order_id,
    });

    if (order.status !== "confirmed" || order.is_payed !== true)
      return next(new CastError("Заказ недоступен для получения билетов"));

    const event = await Event.findOne({ _id: order.event_id });

    if (type === "email") {
      await Order.updateOne(
        { _id: order._id },
        {
          is_tickets_print: true,
          $push: {
            history: {
              user_id: req.user._id,
              date: new Date(),
              text: "В заказе был изменен флаг отправки билетов на +",
            },
          },
        }
      );
      const agent = await Agent.findOne({ _id: order.agent_id });
      const fileName = await generateTicket(order._id);
      await sendTicket({ agent: agent, order, fileName: fileName, event });

      return res.status(200).json({ status: "ok!" });
    } else if (type === "file") {
      await Order.updateOne(
        { _id: order._id },
        {
          is_tickets_print: true,
          $push: {
            history: {
              user_id: req.user._id,
              date: new Date(),
              text: "В заказе был изменен флаг сохранения билетов на +",
            },
          },
        }
      );
      const fileName = await generateTicket(order._id);
      return res.status(200).json({ fileName: fileName });
    }
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
  getTickets,
};

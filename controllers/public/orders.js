const { Router } = require("express");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../../errors/ForbiddenError");

const Order = require("../../models/Order");
const PayType = require("../../models/PayType");
const Agent = require("../../models/Agent");
const OrderPlaces = require("../../models/OrderPlaces");
const Place = require("../../models/Place");

const OrderClass = require("../../utils/Order");
const Hall = require("../../models/Hall");
const NotFoundError = require("../../errors/NotFound");
const Event = require("../../models/Event");
const PlacesTariff = require("../../models/PlacesTariff");
const Tariff = require("../../models/Tariff");
const CastError = require("../../errors/CastError");
const sendOrderConfirmed = require("../../utils/mail/sendOrderConfirmed");
const generateTicket = require("../../utils/generateTicket");
const sendTicket = require("../../utils/mail/sendTicket");
const sendOrderChangeStatus = require("../../utils/mail/sendOrderChangeStatus");

const { SYSTEM_URL } = process.env;

const preCreateOrder = async (req, res, next) => {
  try {
    const { agent_id, places, event_id } = req.body;

    const pay_types = await PayType.find(
      {},
      { _id: 1, name: 1, is_public: true, is_active: true }
    );

    const newOrder = new OrderClass({
      agent_id,
      places,
      event_id,
      status: "blank",
    });

    const result = await newOrder.init();

    return res.status(201).json({ ...result, pay_types });
  } catch (e) {
    return next(e);
  }
};

const applyPromocode = async (req, res, next) => {
  try {
    const { _id, promocode } = req.body;

    const order = new OrderClass({
      order_id: _id,
    });
    await order.init();
    const result = await order.update({ promocode });
    return res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { _id, pay_type_id } = req.body;

    await Order.updateOne(
      { _id },
      {
        pay_type_id,
        status: "booked",
        $push: {
          history: {
            user: null,
            date: new Date(),
            text:
              "В заказе изменен тип оплаты на " +
              pay_type_id +
              " и статус на 'booked'",
          },
        },
      }
    );

    await sendOrderConfirmed({ order_id: _id });

    return res.status(200).json({});
  } catch (e) {
    return next(e);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    let ordersFind = await Order.find(
      {
        agent_id: req.agent._id,
      },
      { history: 0 }
    ).sort({
      _id: -1,
    });

    const orders = [];

    for await (const { _doc } of ordersFind) {
      const places = await OrderPlaces.find({ order_id: _doc._id });
      orders.push({
        ..._doc,
        places,
      });
    }

    return res.status(200).json({ orders });
  } catch (e) {
    return next(e);
  }
};

const getMyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne(
      { _id: id, agent_id: req.agent._id },
      { history: 0 }
    );
    if (!order) return next(new NotFoundError("Заказ не найден"));
    const places = await OrderPlaces.find({ order_id: order._id });

    const event = await Event.findOne(
      { _id: order.event_id },
      { name: 1, hall_id: 1, places: 1, type: 1, date: 1 }
    );
    const pay_type = await PayType.findOne(
      { _id: order.pay_type_id },
      { name: 1 }
    );
    const hall = await Hall.findOne(
      { _id: event.hall_id },
      { name: 1, address: 1 }
    );
    const placesResult = [];

    for await (const { _doc } of places) {
      let tariff;
      if (event.type === "places") {
        tariff = await PlacesTariff.findOne(
          { _id: _doc.places_tariff_id },
          { name: 1 }
        );
      } else {
        tariff = await Tariff.findOne({ _id: _doc.tariff_id }, { name: 1 });
      }

      if (event.places) {
        let place = await Place.findOne(
          { _id: _doc.place_id },
          { row: 1, place: 1 }
        );
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

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, agent_id: req.agent._id });

    if (order.status === "confirmed" || order.status === "canceled")
      return next(new CastError("Заказ недоступен для отмены"));

    await Order.updateOne(
      { _id: id, agent_id: req.agent._id },
      {
        status: "canceled",
        $push: {
          history: {
            date: new Date(),
            text: "В заказе изменен статус на canceled",
          },
        },
      }
    );

    const updOrder = await Order.findOne({ _id: id, agent_id: req.agent._id });

    await sendOrderChangeStatus({
      agent: req.agent,
      order: updOrder,
      link: `${SYSTEM_URL}/profile/orders/${order._id}`,
    });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { order_id, type } = req.query;

    const order = await Order.findOne({
      _id: order_id,
      agent_id: req.agent._id,
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
              date: new Date(),
              text: "В заказе был изменен флаг отправки билетов на +",
            },
          },
        }
      );
      const fileName = await generateTicket(order._id);
      await sendTicket({ agent: req.agent, order, fileName: fileName, event });
      return res.status(200).json({ status: "ok!" });
    } else if (type === "file") {
      await Order.updateOne(
        { _id: order._id },
        {
          is_tickets_print: true,
          $push: {
            history: {
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
  preCreateOrder,
  applyPromocode,
  createOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  getTickets,
};

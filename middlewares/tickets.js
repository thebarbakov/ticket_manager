require("dotenv").config();
const UnauthorizedError = require("../errors/UnauthorizedError");
const Order = require("../models/Order");

const checkTicket = async (req, res, next) => {
  try {
    if (!req.originalUrl.match(/\/api\/assets\/tickets\/(.*)\_.*\.pdf/)?.[1])
      return next();
    if (req?.user?.access?.orders === true) return next();

    const order_id = req.originalUrl.match(
      /\/api\/assets\/tickets\/(.*)\_.*\.pdf/
    )?.[1];

    const order = await Order.findOne({ _id: order_id });

    if (String(order.agent_id) !== String(req.agent?._id))
      return next(new UnauthorizedError("Необходима авторизация"));

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = checkTicket;

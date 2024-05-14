require("dotenv").config();
const ServiceUnavailableError = require("../errors/ServiceUnavailableError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const Agent = require("../models/Agent");
const Order = require("../models/Order");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const checkTicket = async (req, res, next) => {
  try {
    if (!req.originalUrl.match(/\/api\/assets\/tickets\/(.*)\_.*\.pdf/)?.[1])
      return next();
    const { ticket_manager_user, ticket_manager_agent } = req.cookies;
    if (ticket_manager_user) {
      const { user_id } = jwt.verify(ticket_manager_user, JWT_SECRET);
      const user = await User.findOne({ _id: user_id });
      if (user?.access?.orders === true) return next();
      else return next(new UnauthorizedError("Необходима авторизация"));
    } else if (ticket_manager_agent) {
      const { agent_id } = jwt.verify(ticket_manager_agent, JWT_SECRET);
      const agent = await Agent.findOne({ _id: agent_id });
      const order_id = req.originalUrl.match(
        /\/api\/assets\/tickets\/(.*)\_.*\.pdf/
      )?.[1];
      const order = await Order.findOne({ _id: order_id });
      if (String(order.agent_id) !== String(agent?._id))
        return next(new UnauthorizedError("Необходима авторизация"));
      else return next();
    } else {
      return next(new UnauthorizedError("Необходима авторизация"));
    }
    return next(new ServiceUnavailableError("Ошибка"));
  } catch (e) {
    return next(e);
  }
};

module.exports = checkTicket;

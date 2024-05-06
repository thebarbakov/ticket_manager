require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const Agent = require("../models/Agent");

const { JWT_SECRET } = process.env;

const agentAuth = async (req, res, next) => {
  try {
    const { ticket_manager_agent } = req.cookies;

    if (!ticket_manager_agent) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    const { agent_id } = jwt.verify(ticket_manager_agent, JWT_SECRET);

    const agent = await Agent.findOne({ _id: agent_id });

    if (!agent) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    req.agent = agent;

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = agentAuth;

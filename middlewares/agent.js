require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const Agent = require("../models/Agent");

const { JWT_SECRET } = process.env;

const agentAuth = async (req, res, next) => {
  try {
    const { ticket_manager_agent } = req.cookies;

    const { agent_id } = jwt.verify(ticket_manager_agent, JWT_SECRET);

    let agent = await Agent.findOne({ _id: agent_id });

    if (!agent) {
      const newAgent = new Agent({
        utm_source: req.params.utm_source,
        user_agent: req.get("user-agent"),
        ip: req.ip,
      });
      await newAgent.save();

      res.cookie(
        "ticket_manager_agent",
        { agent_id: newAgent._id },
        {
          maxAge: 60 * 60 * 24 * 30000,
          httpOnly: true,
        }
      );

      agent = newAgent;
    }

    if (agent && !agent.ip) {
      await Agent.updateOne(
        { _id: agent._id },
        {
          utm_source: req.params.utm_source,
          user_agent: req.get("user-agent"),
          ip: req.ip,
        }
      );
      agent = await Agent.findOne({ _id: agent_id });
    }

    req.agent = agent;

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = agentAuth;

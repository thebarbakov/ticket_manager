require("dotenv").config();
const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../../errors/UnauthorizedError");
const ConflictError = require("../../errors/ConflictError");

const User = require("../../models/User");
const Agent = require("../../models/Agent");
const AgentCode = require("../../models/AgentCode");
const CastError = require("../../errors/CastError");
const generateRandomString = require("../../utils/generateRandomString");
const sendAgentCode = require("../../utils/mail/sendAgentCode");

const { JWT_SECRET, SYSTEM_URL } = process.env;

const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const agent = await Agent.findOne({ email }, "+password");

    if (!agent) {
      return next(new UnauthorizedError("Неправильная почта"));
    }

    const oldCode = await AgentCode.find({
      agent_id: agent._id,
      generated_in: {
        $gte: new Date().setMinutes(new Date().getMinutes() - 1),
      },
    });

    if (oldCode.length > 0)
      return next(new CastError("Код был отправлен меньше минуты назад"));

    const newCode = new AgentCode({
      agent_id: agent._id,
      code: generateRandomString(6),
      generated_in: new Date(),
    });

    await newCode.save();

    sendAgentCode({
      agent,
      code: newCode.code,
      link: `${SYSTEM_URL}/agent/sign_in?code=${newCode.code}&agent_id=${agent._id}`,
    });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, code, agent_id } = req.body;

    let agent;

    if (agent_id) {
      agent = await Agent.findOne({ _id: agent_id });
    } else if (email) {
      agent = await Agent.findOne({ email });
    }

    if (!agent) {
      return next(new UnauthorizedError("Неправильная почта или пароль"));
    }

    const codeDB = await AgentCode.findOne({ agent_id: agent._id, used: false }).sort({_id: -1});

    if (codeDB.code !== code) {
      return next(new UnauthorizedError("Неправильный код"));
    }

    const token = jwt.sign({ agent_id: agent._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    await AgentCode.updateOne({_id: codeDB._id}, {used: true})

    return res
      .status(200)
      .cookie("ticket_manager_agent", token, {
        maxAge: 60 * 60 * 24 * 30000,
        httpOnly: true,
      })
      .json({ status: "ok!", agent });
  } catch (e) {
    return next(e);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { first_name, second_name, email, phone } = req.body;

    const agent = new Agent({
      first_name,
      second_name,
      email,
      phone,
      utm_source: req.params.utm_source,
      user_agent: req.get("user-agent"),
      ip: req.ip,
    });

    const newAgent = await agent.save();

    const token = jwt.sign({ agent_id: newAgent._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(201)
      .cookie("ticket_manager_agent", token, {
        maxAge: 60 * 60 * 24 * 30000,
        httpOnly: true,
      })
      .json({ agent: newAgent });
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError("Пользователь уже существует"));
    }
    return next(e);
  }
};

const signOut = async (req, res, next) => {
  try {
    return res.clearCookie("ticket_manager_agent").json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  signIn,
  signUp,
  signOut,
  sendCode,
};

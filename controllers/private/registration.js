require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UnauthorizedError = require("../../errors/UnauthorizedError");
const ConflictError = require("../../errors/ConflictError");

const User = require("../../models/User");

const { NODE_ENV, JWT_SECRET } = process.env;

const signIn = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login }, "+password");
    console.log(user)
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

    return res
      .status(200)
      .cookie("ticket_manager_user", token, {
        maxAge: 60 * 60 * 24 * 30000,
        httpOnly: true,
      })
      .json({ status: "ok!", user });
  } catch (e) {
    return next(e);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { first_name, second_name, login, email, password } = req.body;

    const user = new User({
      is_active: true,
      first_name,
      second_name,
      login,
      email,
      access: {
        scanner: true,
        set_pay_status: true,
        orders: true,
        pay_types: true,
        events: true,
        halls: true,
        agents: true,
        users: true,
        discounts: true,
        tariff: true,
        is_root: true,
      },
      scanner: "test123",
      password: await bcrypt.hash(password, 10),
    });

    const newUser = await user.save();

    newUser.password = undefined;

    return res.status(201).json(newUser);
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return next(new ConflictError("Пользователь уже существует"));
    }
    return next(e);
  }
};

const signOut = async (req, res, next) => {
  try {
    return res.clearCookie("ticket_manager_user").json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  signIn,
  signUp,
  signOut,
};

require("dotenv").config();
const jwt = require("jsonwebtoken");
const ForbiddenError = require("../errors/ForbiddenError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const User = require("../models/User");

const { JWT_SECRET } = process.env;

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization !== undefined ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    const {user_id} = jwt.verify(token, JWT_SECRET);
  
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    if (!user.is_active) {
      return next(new ForbiddenError("Аккаунт выключен"));
    }

    req.user = user;
    
    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = userAuth;

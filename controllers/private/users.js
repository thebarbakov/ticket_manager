const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const User = require("../../models/User");
const generateRandomString = require("../../utils/generateRandomString");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    if (req.user.access.users !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.first_name !== undefined) {
      filter.first_name = { $regex: new RegExp(req.query.first_name, "i") };
    }
    if (req.query.second_name !== undefined) {
      filter.second_name = { $regex: new RegExp(req.query.second_name, "i") };
    }
    if (req.query.login !== undefined) {
      filter.login = { $regex: new RegExp(req.query.login, "i") };
    }
    if (req.query.is_active !== undefined) {
      filter.is_active = req.query.is_active;
    }

    const users = await User.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const totalDocs = await User.find(filter).countDocuments();
    return res.status(200).json({ users, totalDocs, currentPage: req.query.p });
  } catch (e) {
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    if (req.user.access.users !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const user = await User.findOne({ _id: req.params.id });
    return res.status(200).json({ user });
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    if (req.user.access.users !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      is_active,
      first_name,
      second_name,
      login,
      email,
      password,
      access,
    } = req.body;

    const candidate = await User.find({ login });

    const editor = {
      is_active,
      first_name,
      second_name,
      login,
      email,
      access,
    };

    if (candidate.length !== 0)
      return next(new ConflictError("Login уже используется"));

    if (editor.access) {
      const accesses = Object.keys(editor.access);
      const editorUser = await User.findOne({ _id: req.user._id });

      accesses.forEach((el) => {
        if (!editorUser.access[el]) {
          delete editor.access[el];
        }
      });
    }

    if (password) {
      editor.password = await bcrypt.hash(req.body.password, 10);
    }

    let newUser = new User({ ...editor, scanner: generateRandomString(32) });

    newUser = await newUser.save();

    return res.status(201).json({ user: newUser });
  } catch (e) {
    return next(e);
  }
};

const editUser = async (req, res, next) => {
  try {
    if (req.user.access.users !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      is_active,
      first_name,
      second_name,
      login,
      email,
      password,
      access,
      _id,
    } = req.body;

    const candidate = await User.find({ login, _id: { $ne: _id } });

    const editor = {
      is_active,
      first_name,
      second_name,
      login,
      email,
      access,
    };

    if (candidate.length !== 0)
      return next(new ConflictError("Email уже используется"));

    if (editor.access) {
      const accesses = Object.keys(editor.access);
      const editorUser = await User.findOne({ _id: req.user._id });

      accesses.forEach((el) => {
        if (!editorUser.access[el]) {
          delete editor.access[el];
        }
      });
    }

    if (password) {
      editor.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.updateOne({ _id }, editor);

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await User.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    return res.status(200).json({ user });
  } catch (e) {
    return next(e);
  }
};

const editMe = async (req, res, next) => {
  try {
    const { first_name, second_name, login, email, password } = req.body;

    const candidate = await User.find({ login, _id: { $ne: req.user._id } });

    const editor = {
      first_name,
      second_name,
      login,
      email,
    };

    if (candidate.length !== 0)
      return next(new ConflictError("Email уже используется"));

    if (password) {
      editor.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.updateOne({ _id: req.user._id }, editor);

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
  getMe,
  editMe,
};

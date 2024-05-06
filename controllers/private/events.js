const { Router } = require("express");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const User = require("../../models/User");
const generateRandomString = require("../../utils/generateRandomString");
const Event = require("../../models/Event");
const Hall = require("../../models/Hall");
const CastError = require("../../errors/CastError");

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

const getEvents = async (req, res, next) => {
  try {
    if (req.user.access.events !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.name !== undefined) {
      filter.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.description !== undefined) {
      filter.description = { $regex: new RegExp(req.query.description, "i") };
    }
    if ((req.query.f_date !== undefined) & (req.query.t_date !== undefined)) {
      filter.date = {
        $gte: todayFrom(req.query.f_date),
        $lt: todayTo(req.query.t_date),
      };
    }
    if ((req.query.f_date === undefined) & (req.query.t_date !== undefined)) {
      filter.date = { $lt: todayTo(req.query.t_date) };
    }
    if ((req.query.f_date !== undefined) & (req.query.t_date === undefined)) {
      filter.date = { $gte: todayFrom(req.query.f_date) };
    }

    const events = await Event.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );

    const totalDocs = await Event.find(filter).countDocuments();

    return res
      .status(200)
      .json({ events, totalDocs, currentPage: req.query.p });
  } catch (e) {
    return next(e);
  }
};

const getEvent = async (req, res, next) => {
  try {
    if (req.user.access.events !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const event = await Event.findOne({ _id: req.params.id });
    return res.status(200).json({ event });
  } catch (e) {
    return next(e);
  }
};

const getCreatonOrderInfo = async (req, res, next) => {
  try {
    if (req.user.access.orders !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const halls = await Hall.find({}, { _id: 1, name: 1, address: 1 });

    return res.status(200).json({ halls });
  } catch (e) {
    return next(e);
  }
};

const createEvent = async (req, res, next) => {
  try {
    if (req.user.access.events !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      hall_id,
      name,
      description,
      date,
      image_file,
      image_file_name,
      places,
      type,
      open_sales,
      close_sales,
    } = req.body;

    const hall = await Hall.findOne({ _id: hall_id });

    if (!hall) return next(new CastError("Неверное id зала"));

    if (hall.scheme === undefined || hall.scheme === null)
      return next(new CastError("У зала нет схемы для учета мест при продаже"));

    let newEvent = new Event({
      hall_id,
      name,
      description,
      date,
      places,
      type,
      open_sales,
      close_sales,
    });

    if (image_file && image_file_name) {
      const base64Data = image_file.replace(/^data:.*?;base64,/, "");
      var file_name_ready = `event_${new Date().getTime()}.${
        image_file_name.match(/.*\.(.*)/)[1]
      }`;

      fs.writeFileSync(
        `./assets/events_posters/${file_name_ready}`,
        base64Data,
        {
          encoding: "base64",
        }
      );
      newEvent.image = file_name_ready;
    }

    newEvent = await newEvent.save();

    return res.status(200).json({ event: newEvent });
  } catch (e) {
    return next(e);
  }
};

const editEvent = async (req, res, next) => {
  try {
    if (req.user.access.events !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const {
      _id,
      name,
      description,
      date,
      image_file,
      image_file_name,
      open_sales,
      close_sales,
    } = req.body;

    const editor = {
      name,
      description,
      date,
      open_sales,
      close_sales,
    };

    if (image_file && image_file_name) {
      const base64Data = image_file.replace(/^data:.*?;base64,/, "");
      var file_name_ready = `event_${new Date().getTime()}.${
        image_file_name.match(/.*\.(.*)/)[1]
      }`;

      fs.writeFileSync(
        `./assets/events_posters/${file_name_ready}`,
        base64Data,
        {
          encoding: "base64",
        }
      );
      editor.image = file_name_ready;
    }

    await Event.updateOne({ _id }, editor);

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await Event.deleteOne({ _id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  getCreatonOrderInfo,
  editEvent,
  deleteEvent,
};

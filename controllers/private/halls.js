const { Router } = require("express");
const fs = require("node:fs");
const { ObjectId } = require("mongodb");
const ForbiddenError = require("../../errors/ForbiddenError");
const Hall = require("../../models/Hall");
const Place = require("../../models/Place");
const generateHall = require("../../utils/generateHall");

// /api/groups

const getHalls = async (req, res, next) => {
  try {
    if (req.user.access.halls !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const filter = {};
    if (req.query.name !== undefined) {
      filter.name = { $regex: new RegExp(req.query.name, "i") };
    }

    const halls = await Hall.find(filter)
      .sort({
        [req.query.sort_by ? req.query.sort_by : "_id"]: req.query.sort_dir
          ? req.query.sort_dir
          : 1,
      })
      .limit(req.query.s ? req.query.s : 10)
      .skip(
        (req.query.p ? req.query.p - 1 : 0) * (req.query.s ? req.query.s : 10)
      );
    const totalDocs = await Hall.find(filter).countDocuments();

    return res.status(200).json({ halls, totalDocs, currentPage: req.query.p });
  } catch (e) {
    return next(e);
  }
};

const getHall = async (req, res, next) => {
  try {
    if (req.user.access.halls !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    const hall = await Hall.findOne({ _id: req.params.id });
    const places = await Place.find({ hall_id: req.params.id });
    return res.status(200).json({ hall, places });
  } catch (e) {
    return next(e);
  }
};

const preCreateHall = async (req, res, next) => {
  try {
    if (req.user.access.halls !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { scheme_file, scheme_file_name } = req.body;
    const base64Data = scheme_file.replace(/^data:.*?;base64,/, "");
    const file_name = `${new Date().getTime()}.${
      scheme_file_name.match(/.*\.(.*)/)[1]
    }`;
    fs.writeFileSync(`./assets/halls_schemes/raw/${file_name}`, base64Data, {
      encoding: "base64",
    });

    const svgString = fs.readFileSync(
      `./assets/halls_schemes/raw/${file_name}`,
      "utf8"
    );

    const { places, parsedSvgData } = generateHall({
      svgData: svgString,
      hall_id: 1,
    });

    console.log(places);

    return res.status(200).json({ file_name, places });
  } catch (e) {
    return next(e);
  }
};

const createHall = async (req, res, next) => {
  try {
    if (req.user.access.halls !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { name, address, scheme_file, scheme_file_name, file_name } =
      req.body;

    if (scheme_file) {
      const base64Data = scheme_file.replace(/^data:.*?;base64,/, "");
      var fileNameRaw = `${new Date().getTime()}.${
        scheme_file_name.match(/.*\.(.*)/)[1]
      }`;
      fs.writeFileSync(
        `./assets/halls_schemes/raw/${fileNameRaw}`,
        base64Data,
        {
          encoding: "base64",
        }
      );
    }

    const svgString = fs.readFileSync(
      `./assets/halls_schemes/raw/${file_name ? file_name : fileNameRaw}`,
      "utf8"
    );

    const newHallBlank = new Hall({
      name,
      address,
    });

    const newHall = await newHallBlank.save();

    const { places, parsedSvgData } = generateHall({
      svgData: svgString,
      hall_id: newHall._id,
    });

    var file_name_ready = `hall_scheme_${newHall._id}_${new Date().getTime()}.${
      file_name
        ? file_name.match(/.*\.(.*)/)[1]
        : scheme_file_name.match(/.*\.(.*)/)[1]
    }`;

    fs.writeFileSync(
      `./assets/halls_schemes/${file_name_ready}`,
      parsedSvgData,
      "utf8"
    );

    await Hall.findOneAndUpdate(
      { _id: newHall._id },
      { scheme: file_name_ready }
    );

    await Place.insertMany(places);

    const hall_places = await Place.find({ hall_id: newHall._id });

    return res.status(200).json({ newHall, hall_places });
  } catch (e) {
    return next(e);
  }
};

const editHall = async (req, res, next) => {
  try {
    if (req.user.access.halls !== true)
      return next(new ForbiddenError("Недостаточно прав"));
    const { name, address, _id } = req.body;
    await Hall.findOneAndUpdate({ _id }, { name, address });
    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

const deleteHall = async (req, res, next) => {
  try {
    if (req.user.access.is_root !== true)
      return next(new ForbiddenError("Недостаточно прав"));

    await Hall.deleteOne({ _id: req.params.id });
    await Place.deleteMany({ hall_id: req.params.id });

    return res.status(200).json({ status: "ok!" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getHalls,
  preCreateHall,
  getHall,
  createHall,
  editHall,
  deleteHall,
};

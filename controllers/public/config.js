const Config = require("../../models/Config");

const getInitConfig = async (req, res, next) => {
  try {
    const result = await Config.find({
      key: { $in: ["pay_types.currency", "orders.max_tickets"] },
    });
    const config = {};

    result.forEach((el) => {
      config[el.key] = el.value;
    });

    return res.status(200).json({ config });
  } catch (e) {
    return next(e);
  }
};

module.exports = getInitConfig;

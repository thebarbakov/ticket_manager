const Config = require("../../models/Config");
const Order = require("../../models/Order");

const cancelBlankOrders = async () => {
  const config = await Config.findOne({ key: "orders.cancel_after_booked" });
  await Order.updateMany(
    {
      status: "blank",
      created_date: {
        $lte: new Date().setMinutes(new Date().getMinutes() - config.value),
      },
    },
    { status: "canceled" }
  );
};

module.exports = cancelBlankOrders;

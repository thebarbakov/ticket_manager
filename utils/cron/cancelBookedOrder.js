const Config = require("../../models/Config");
const Order = require("../../models/Order");

const cancelBookedOrder = async () => {
  const config = await Config.findOne({ key: "orders.cancel_after_booked" });
  await Order.updateMany(
    {
      status: "booked",
      created_date: {
        $lte: new Date().setHours(new Date().getHours() - config.value),
      },
    },
    { status: "canceled" }
  );
};

module.exports = cancelBookedOrder;

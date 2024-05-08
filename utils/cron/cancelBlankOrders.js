const Config = require("../../models/Config");
const Order = require("../../models/Order");

const cancelBlankOrders = async () => {
  try {
    const config = await Config.findOne({ key: "orders.cancel_after_booked" });
    await Order.updateMany(
      {
        status: "blank",
        created_date: {
          $lte: new Date(
            new Date().setMinutes(
              new Date().getMinutes() - Number(config.value)
            )
          ),
        },
      },
      { status: "canceled" }
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = cancelBlankOrders;

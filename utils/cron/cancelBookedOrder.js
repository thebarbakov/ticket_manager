const Agent = require("../../models/Agent");
const Config = require("../../models/Config");
const Order = require("../../models/Order");
const sendOrderChangeStatus = require("../mail/sendOrderChangeStatus");
const { SYSTEM_URL } = process.env;

const cancelBookedOrder = async () => {
  const config = await Config.findOne({ key: "orders.cancel_after_booked" });

  const orders = await Order.find({
    status: "booked",
    created_date: {
      $lte: new Date().setHours(new Date().getHours() - config.value),
    },
  });

  for await (const order of orders) {
    const agent = await Agent.findOne({ _id: order.agent_id });
    await sendOrderChangeStatus({
      agent,
      order,
      link: `${SYSTEM_URL}/profile/orders/${order._id}`,
    });
  }
  
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

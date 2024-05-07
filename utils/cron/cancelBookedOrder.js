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
      $lte:  new Date(new Date().setHours(new Date().getHours() - Number(config.value))),
    },
  });

  for await (const order of orders) {
    const agent = await Agent.findOne({ _id: order.agent_id });
    order.status = "canceled";
    order.is_payed = false;

    await sendOrderChangeStatus({
      agent,
      order: order,
      link: `${SYSTEM_URL}/profile/orders/${order._id}`,
    });
  }

  await Order.updateMany(
    {
      status: "booked",
      created_date: {
        $lte:  new Date(new Date().setHours(new Date().getHours() - Number(config.value))),
    },
    },
    { status: "canceled" }
  );
};

module.exports = cancelBookedOrder;

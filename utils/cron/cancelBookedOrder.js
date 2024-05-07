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

  for await (const { _doc } of orders) {
    const agent = await Agent.findOne({ _id: _doc.agent_id });
    await sendOrderChangeStatus({
      agent,
      order: _doc,
      link: `${SYSTEM_URL}/profile/orders/${_doc._id}`,
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

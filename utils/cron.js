const cron = require("node-cron");
const cancelBlankOrders = require("./cron/cancelBlankOrders");
const cancelBookedOrder = require("./cron/cancelBookedOrder");
const deleteFilesInFolder = require("./cron/deleteFilesInFolder");

cron.schedule(
  "*/15 * * * *",
  () => {
    deleteFilesInFolder("./assets/halls_schemes/raw");
    deleteFilesInFolder("./assets/tickets");
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "*/1 * * * *",
  async () => {
    await cancelBlankOrders();
    await cancelBookedOrder();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

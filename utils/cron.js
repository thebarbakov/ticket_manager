const cron = require("node-cron");
const createRecomendation = require("./recomendation/createRecomendation");
const crowlMealty = require("./crowlMealty");
const deleteFilesInFolder = require("./deleteFilesInFolder");
const removeAvatars = require("./removeAvatars");
const { resetSuggested } = require("./resetSuggested");
const { applicationNotifing, remindToOrder } = require("./telegramFunctions");
const sendEmail = require("./mail/sendEmail");
const learnSystem = require("./recomendation/learnSystem");
const saveRecomendation = require("./saveRecomendation");

cron.schedule(
  "00 22 * * 3",
  async () => {
    await resetSuggested();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 22 * * 5",
  async () => {
    await resetSuggested();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 20 * * 3",
  async () => {
    await applicationNotifing();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 21 * * 3",
  async () => {
    await applicationNotifing();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 19 * * 7",
  async () => {
    await applicationNotifing();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 20 * * 7",
  async () => {
    await applicationNotifing();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 21 * * 7",
  async () => {
    await applicationNotifing();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 22 * * 3",
  async () => {
    await crowlMealty();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "00 22 * * 5",
  async () => {
    await crowlMealty();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "25 4 * * *",
  () => {
    console.log(1);
    deleteFilesInFolder("./media/import");
    deleteFilesInFolder("./media/export/applications");
    deleteFilesInFolder("./media/export/reports");
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "25 4 * * 7",
  async () => {
    await removeAvatars();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "25 4 * * 7",
  async () => {
    await saveRecomendation();
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);
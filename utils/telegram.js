const { Telegraf } = require("telegraf");
require("dotenv").config();
const { createCipheriv } = require("crypto");

const User = require("../models/User");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  const secret = ctx.startPayload.replace("auth_", "");
  const decipher = createCipheriv(
    "aes-256-ctr",
    process.env.TG_KEY_CRRPT,
    "yxhkwv34777wwjis"
  );
  const decryptedMessage =
    decipher.update(secret, "base64url", "utf-8") + decipher.final("utf-8");
  const userId = decryptedMessage.toString("utf-8").replace(/___.*/, "");
  const user = await User.findOne({ _id: userId });

  ctx.reply(
    `Привет, ${user.name}! Это Бот сервиса еды в Инспиро. Ты можешь настроить уведомления в настройках своего профиля.`
  );
  await User.updateOne({ _id: userId }, { tg_id: ctx.message.chat.id });
});

const sendMessage = async (id, text, buttons) => {
  if (buttons) {
    bot.telegram.sendMessage(id, text, {
      parse_mode: "html",
      reply_markup: {
        keyboard: buttons,
      },
    });
  } else {
    bot.telegram.sendMessage(id, text);
  }
};

bot.hears("Билеты", (ctx) => ctx.reply("Не нужны мне никакие билеты"));

bot.launch();

module.exports = { sendMessage, sendMessageAdmin };

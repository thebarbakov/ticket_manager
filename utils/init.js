const User = require("../models/User");
const Config = require("../models/Config");
const bcrypt = require("bcryptjs");

async function init() {
  const users = User.find();
  if (users.length !== 0) return;

  const user = new User({
    is_active: true,
    first_name: "Admin",
    login: "admin",
    email: "admin@admin.ad",
    access: {
      scanner: true,
      set_pay_status: true,
      orders: true,
      pay_types: true,
      events: true,
      halls: true,
      agents: true,
      users: true,
      discounts: true,
      tariff: true,
      is_root: true,
    },
    password: await bcrypt.hash("1703", 10),
  });

  await user.save();

  await Config.insertMany([
    { key: "pay_types.currency", name: "Валюта", value: "₽", group: "Типы оплат" },
    { key: "pay_types.transfer.card_number", name: "Номер карты для перевода", value: "", group: "Типы оплат" },
    { key: "pay_types.transfer.descr", name: "Описание к переводу", value: "", group: "Типы оплат" },
    { key: "pay_types.cash.descr", name: "Описание к оплату за наличные", value: "", group: "Типы оплат" },
    { key: "orders.max_tickets", name: "Максимальное кол-во билетов в заказе", value: 10, group: "Заказы" },
    { key: "orders.cancel_after_blank", name: "Отменять черновые заказы через (мин)", value: 10, group: "Заказы" },
    { key: "orders.cancel_after_booked", name: "Отменять забронированные, не оплаченные, заказы через (час)", value: 24, group: "Заказы" },
    { key: "events.scan_until", name: "Разрешить пропуск за (мин)", value: 120, group: "Мероприятия" },
  ]);
}

module.exports = init;

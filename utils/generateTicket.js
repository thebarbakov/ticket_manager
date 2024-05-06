const pdf = require("pdf-creator-node");
const fs = require("fs");
const Order = require("../models/Order");
const Hall = require("../models/Hall");
const Place = require("../models/Place");
const PlacesTariff = require("../models/PlacesTariff");
const Tariff = require("../models/Tariff");
const OrderPlaces = require("../models/OrderPlaces");
const Agent = require("../models/Agent");
const Event = require("../models/Event");
const QRCode = require("qrcode");
const Config = require("../models/Config");

async function generateTicket(order_id) {
  const template = fs.readFileSync("./assets/template/ticket.html", "utf8");
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "10mm",
    },
    footer: {
      height: "28mm",
    },
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null",
      },
    },
  };
  const tickets = [];

  const order = await Order.findOne({ _id: order_id });

  const agent = await Agent.findOne({ _id: order.agent_id });

  const event = await Event.findOne({ _id: order.event_id });

  const hall = await Hall.findOne({ _id: event.hall_id });

  const config = await Config.findOne({ key: "pay_types.currency" });

  if (event.places) var places = await Place.find({ hall_id: hall._id });

  let tariffs;

  if (event.type === "places")
    tariffs = await PlacesTariff.find({ event_id: event._id });
  else if (event.type === "tariff")
    tariffs = await Tariff.find({ event_id: event._id });

  const orderPlaces = await OrderPlaces.find({ order_id: order_id });

  for await (const place of orderPlaces) {
    const base64qr = await QRCode.toDataURL(String(place._id));
    tickets.push({
      number: order.number,
      event_name: event.name,
      event_date: new Date(event.date).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      hall_name: hall.name,
      hall_address: hall.address,
      place_field: event.places ? "Место" : "Тариф",
      place: event.places
        ? event.type === "places"
          ? `${
              places.find((le) => String(le._id) === String(place.place_id)).row
            } ряд, ${
              places.find((le) => String(le._id) === String(place.place_id))
                .place
            } место`
          : `${
              places.find((le) => String(le._id) === String(place.place_id)).row
            } ряд, ${
              places.find((le) => String(le._id) === String(place.place_id))
                .place
            } место | ${
              tariffs.find((le) => String(le._id) === String(place.tariff_id))
                .name
            }`
        : tariffs.find((le) => String(le._id) === String(place.tariff_id)).name,
      owner: place.name
        ? place.name
        : `${agent.first_name} ${agent.second_name}`,
      price: place.total_sum + config.value,
      place_id: place._id,
      qr: base64qr,
    });
  }

  const fileName = `${order_id}_${new Date().getTime()}.pdf`;

  var document = {
    html: template,
    data: {
      tickets,
    },
    path: `./assets/tickets/${fileName}`,
    type: "",
  };

  await pdf.create(document, options);

  return fileName;
}

module.exports = generateTicket;

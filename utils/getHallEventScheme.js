const Event = require("../models/Event");
const Hall = require("../models/Hall");
const OrderPlaces = require("../models/OrderPlaces");
const Place = require("../models/Place");
const PlacesTariff = require("../models/PlacesTariff");
const Tariff = require("../models/Tariff");
const Order = require("../models/Order");

async function getHallEventScheme({ event_id, show_order }) {
  const event = await Event.findOne({ _id: event_id });
  const hall = await Hall.findOne({ _id: event.hall_id });

  const result = {
    event,
    hall,
    places: [],
  };

  const ordersForEvent = await Order.find({
    event_id: event._id,
    status: { $ne: "canceled" },
  });

  if (event.type === "tariff") {
    const tariffs = await Tariff.find({ event_id: event_id });
    result.tariffs = [];
    for await (const { _doc } of tariffs) {
      const tariff = _doc;
      if (tariff.is_on_limit) {
        const orders = await OrderPlaces.find({
          tariff_id: tariff._id,
          order_id: { $in: ordersForEvent.map((el) => el._id) },
        });
        result.tariffs.push({
          ...tariff,
          limit_booked: orders.length,
          limit_left: tariff.limit - orders.length,
        });
      } else {
        result.tariffs.push(tariff);
      }
    }
  } else if (event.type === "places") {
    result.places_tariff = await PlacesTariff.find({ event_id: event_id });
  }

  if (!event.places) return result;

  const places = await Place.find({ hall_id: hall._id });

  result.places = [];

  for await (const { _doc } of places) {
    const place = _doc;
    if (event.type === "tariff") {
      const place_order = await OrderPlaces.findOne({
        order_id: { $in: ordersForEvent.map((el) => el._id) },
        place_id: place._id,
      });
      const obj = {
        ...place,
        is_booked: place_order ? true : false,
      };
      if (show_order) obj.order = place_order;
      result.places.push(obj);
    } else if (event.type === "places") {
      const place_order = await OrderPlaces.findOne({
        order_id: { $in: ordersForEvent.map((el) => el._id) },
        place_id: place._id,
      });
      const obj = {
        ...place,
        is_booked: place_order ? true : false,
        tariff: result.places_tariff.find((tr) =>
          tr.places.find((pl) => String(pl.id) === String(place._id))
        )
          ? result.places_tariff.find((tr) =>
              tr.places.find((pl) => String(pl.id) === String(place._id))
            )._id
          : null,
        color: result.places_tariff.find((tr) =>
          tr.places.find((pl) => String(pl.id) === String(place._id))
        )
          ? result.places_tariff.find((tr) =>
              tr.places.find((pl) => String(pl.id) === String(place._id))
            ).color
          : null,
      };
      if (show_order) obj.order_id = place_order.order_id;
      result.places.push(obj);
    }
  }

  return result;
}

module.exports = getHallEventScheme;

const Event = require("../models/Event");
const Hall = require("../models/Hall");
const OrderPlaces = require("../models/OrderPlaces");
const Place = require("../models/Place");
const PlacesTariff = require("../models/PlacesTariff");
const Tariff = require("../models/Tariff");

async function getHallEventScheme({ event_id, show_order }) {
  const event = await Event.findOne({ _id: event_id });
  const hall = await Hall.findOne({ _id: event.hall_id });

  const result = {
    event,
    hall,
    places: [],
  };

  if (event.type === "tariff") {
    const tariffs = await Tariff.find({ event_id: event_id });
    result.tarriff = [];
    for await (const tariff of tariffs) {
      if (tariff.limit) {
        const orders = await OrderPlaces.find({ tariff_id: tariff.id });
        result.tarriff.push({
          ...tariff,
          limit_booked: orders.length,
          limit_left: tariff.limit - orders.length,
        });
      }
    }
  } else if (event.type === "places") {
    result.places_tarriff = await PlacesTariff.find({ event_id: event_id });
  }

  if (!event.places) return result;

  const places = await Place.find({ hall_id: hall._id });

  result.places = [];

  const ordersForEvent = await Order.find({ event_id: event._id });

  for await (const place of places) {
    if (event.type === "tariff") {
      const place_order = await OrderPlaces.findOne({
        order_id: { $in: ordersForEvent.map((el) => el._id) },
        place_id: place._id,
      });
      const obj = {
        ...place,
        is_booked: place_order ? true : false,
      };
      if (show_order) obj.order_id = place_order.order_id;
      result.places.push(obj);
    } else if (event.type === "places") {
      const place_order = await OrderPlaces.findOne({
        order_id: { $in: ordersForEvent.map((el) => el._id) },
        place_id: place._id,
      });
      const obj = {
        ...place,
        is_booked: place_order ? true : false,
        tariff: result.places_tarriff.find((tr) =>
          tr.places.find((pl) => pl.id === place._id)
        )._id,
        color: result.places_tarriff.find((tr) =>
          tr.places.find((pl) => pl.id === place._id)
        ).color,
      };
      if (show_order) obj.order_id = place_order.order_id;
      result.places.push(obj);
    }
  }

  return result;
}

module.exports = getHallEventScheme;

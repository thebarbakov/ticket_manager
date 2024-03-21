const { Schema, model, Types } = require("mongoose");

const orderPlacesSchema = new Schema({
  order_id: {
    type: Types.ObjectId,
    ref: "Order",
    required: true,
  },
  place_id: {
    type: Types.ObjectId,
    ref: "place",
  },
  tariff_id: {
    type: Types.ObjectId,
    ref: "Tariff",
  },
  places_tariff_id: {
    type: Types.ObjectId,
    ref: "PlacesTariff",
  },
  price: { type: Number, required: true },
  discount_sum: { type: Number, required: true },
  total_sum: { type: Number, required: true },
  name: { type: String },
  phone: { type: String },
  email: { type: String },

  is_scanned: { type: Boolean, required: true, default: false },
});

module.exports = model("OrderPlaces", orderPlacesSchema);

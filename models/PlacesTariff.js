const { Schema, model, Types } = require("mongoose");

const placesTariffSchema = new Schema({
  hall_id: {
    type: Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  event_id: {
    type: Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String },
  places: [
    {
      id: {
        type: Types.ObjectId,
        ref: "Place",
      },
    },
  ],
});

module.exports = model("PlacesTariff", placesTariffSchema);

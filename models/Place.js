const { Schema, model, Types } = require("mongoose");

const placeSchema = new Schema({
  hall_id: {
    type: Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  row: { type: Number, required: true },
  place: { type: Number, required: true },
  coordinate: {
    cx: { type: String },
    cy: { type: String },
    r: { type: String },
  },
});

module.exports = model("Place", placeSchema);

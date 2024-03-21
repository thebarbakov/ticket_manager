const { Schema, model, Types } = require("mongoose");

const eventSchema = new Schema({
  hall_id: {
    type: Types.ObjectId,
    ref: "Hall",
    required: true,
  },

  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  image: { type: String },

  places: { type: Boolean, default: true, required: true },

  type: {
    type: String,
    required: true,
    default: "tariff",
    enum: ["tariff", "places"],
  },

  open_sales: { type: Date },
  close_sales: { type: Date },
});

module.exports = model("Event", eventSchema);

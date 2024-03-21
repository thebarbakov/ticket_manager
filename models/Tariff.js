const { Schema, model, Types } = require("mongoose");

const tariffSchema = new Schema({
  event_id: {
    type: Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  limit: { type: Number },
  is_on_limit: {type: Boolean, required: true, default: false },
  price: { type: Number, required: true },
});

module.exports = model("Tariff", tariffSchema);

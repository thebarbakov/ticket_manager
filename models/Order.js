const { Schema, model, Types } = require("mongoose");

const orderSchema = new Schema({
  number: {
    required: true,
    type: Number,
    unique: true,
  },
  event_id: {
    type: Types.ObjectId,
    ref: "event",
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  created_by: {
    type: Types.ObjectId,
    ref: "user",
  },
  agent_id: {
    type: Types.ObjectId,
    ref: "agent",
  },
  discount: {
    type: Types.ObjectId,
    ref: "discount",
  },
  summa: { type: Number, required: true },
  discount_sum: { type: Number, required: true },
  total_sum: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    default: "booked",
    enum: ["blank", "booked", "confirmed", "canceled"],
  },
  pay_type_id: {
    type: Types.ObjectId,
    ref: "PayType",
  },
  is_tickets_sent: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_tickets_print: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_payed: {
    type: Boolean,
    required: true,
    default: false,
  },
  history: [
    {
      user_id: {
        type: Types.ObjectId,
        ref: "user",
      },
      date: {
        type: Date,
        default: new Date(),
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = model("Order", orderSchema);

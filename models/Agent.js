const { Schema, model, Types } = require("mongoose");

const agentSchema = new Schema({
  first_name: { type: String },
  second_name: { type: String },

  phone: { type: String },
  email: { type: String },

  utm_source: {
    type: String,
    default: "direct",
    required: true
  },
  user_agent: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true,
  },
});

module.exports = model("Agent", agentSchema);

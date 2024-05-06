const { Schema, model, Types } = require("mongoose");

const agentSchema = new Schema({
  first_name: { type: String },
  second_name: { type: String },

  phone: { type: String },
  email: { type: String, unique: true, required: true },

  utm_source: {
    type: String,
    default: "direct",
  },
  user_agent: {
    type: String,
  },
  ip: {
    type: String,
  },
});

module.exports = model("Agent", agentSchema);

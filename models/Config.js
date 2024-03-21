const { Schema, model, Types } = require("mongoose");

const configSchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: String },
  group: { type: String },
});

module.exports = model("Config", configSchema);

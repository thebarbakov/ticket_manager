const { Schema, model, Types } = require("mongoose");

const hallSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  scheme:{ type: String },
});

module.exports = model("Hall", hallSchema);

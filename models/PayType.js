const { Schema, model, Types } = require("mongoose");

const payTypeSchema = new Schema({
  is_active: {type: Boolean, required: true, default: false},
  name: { type: String, required: true },
  description: { type: String },
  code: { type: String },
  is_public: { type: Boolean, required: true, default: false },
});

module.exports = model("PayType", payTypeSchema);

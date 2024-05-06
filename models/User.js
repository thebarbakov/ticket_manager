const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  is_active: { type: Boolean, required: true, default: false },

  first_name: { type: String, required: true },
  second_name: { type: String },

  email: { type: String, unique: true, required: true },

  login: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  scanner: { type: String, required: true },
  tg_id: { type: String },

  access: {
    scanner: { type: Boolean, default: false },
    set_pay_status: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    pay_types: { type: Boolean, default: false },
    events: { type: Boolean, default: false },
    halls: { type: Boolean, default: false },
    agents: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    discounts: { type: Boolean, default: false },
    tariff: { type: Boolean, default: false },
    is_root: { type: Boolean, default: false },
  },
});

module.exports = model("User", userSchema);

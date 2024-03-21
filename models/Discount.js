const { Schema, model, Types } = require("mongoose");

const discountSchema = new Schema({
  name: { type: String, required: true },
  publicName: { type: String },

  is_on: { type: Boolean, required: true, default: false },

  limit_is_active: { type: Boolean, required: true, default: false },
  limit: { type: Number, required: false, default: 0 },

  tariff_available: [
    {
      tariff_id: {
        type: Types.ObjectId,
        ref: "Tariff",
      },
    },
  ],

  places_tariff_available: [
    {
      places_tariff_id: {
        type: Types.ObjectId,
        ref: "PlacesTariff",
      },
    },
  ],

  promocode: { type: String },

  summa: { type: Number },
  percent: { type: Number },

  max_summa: { type: Number },
  min_summa: { type: Number },

  max_places: { type: Number },

  condition_min_summa: { type: Number },
  condition_max_summa: { type: Number },

  condition_min_places: { type: Number },
  condition_max_places: { type: Number },
});

module.exports = model("Discount", discountSchema);

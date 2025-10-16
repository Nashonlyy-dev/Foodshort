const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    contactName: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    address:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const FoodPartnerModel = mongoose.model("FoodPartner", foodPartnerSchema);

module.exports = FoodPartnerModel;

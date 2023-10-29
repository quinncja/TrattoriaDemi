const mongoose = require("mongoose");
const orderType = ["pickup", "delivery"];
const status = ["waiting", "confirmed", "completed"];
const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
  },
  status: {
    type: String,
    default: "waiting",
  },
  tip: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    ENUM: orderType,
  },
  address: {
    type: String,
  },
  notes: {
    type: String,
  },
  utensils: {
    type: Boolean,
  },
  phone: {
    type: String,
    required: true,
  },
  items: {
    type: [Object],
  },
  timePlaced: {
    type: Date,
    default: Date.now,
  },
  estimatedReady: {
    type: Date,
    default: "",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentIntent: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");
const values = [25, 50, 75, 100, 150];

const giftcardSchema = new mongoose.Schema({
  senderName: {
    type: String,
  },
  recipientName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    enum: values,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  email: {
    type: String,
  },
  purchaserName: {
    type: String,
  },
  purchaserEmail: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  datePurchased: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Giftcard", giftcardSchema);

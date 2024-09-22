const mongoose = require("mongoose");
const values = [15, 25, 50, 75, 100];
const giftcardSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
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
});
module.exports = mongoose.model("Giftcard", giftcardSchema);

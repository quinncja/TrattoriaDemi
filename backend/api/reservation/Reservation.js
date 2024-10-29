const mongoose = require("mongoose");
const validStates = ["upcoming", "arrived", "noshow", "cancel"];
const validSizes = ["2top", "3top", "4top", "6top", "xl", "NA"];
const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numGuests: {
    type: Number,
    required: true,
  },
  tableSize: {
    type: String,
    required: true,
    enum: validSizes,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // hh:mm 24h
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: true,
    default: "upcoming",
    enum: validStates,
  },
  selfMade: {
    type: Boolean,
    required: false,
    default: false,
  },
  arrivedTime: {
    type: String, // hh:mm 24h
  },
  sendText: {
    type: Boolean,
    default: false,
  }
});
module.exports = mongoose.model("Reservation", reservationSchema);

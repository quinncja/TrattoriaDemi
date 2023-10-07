const mongoose = require("mongoose");
const validStates = ["upcoming", "arrived", "noshow", "cancel"];
const validSizes = ["2top", "3top", "4top", "5top", "xl"]
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
    default: "Upcoming",
    enum: validStates,
  },
});
module.exports = mongoose.model("Reservation", reservationSchema);

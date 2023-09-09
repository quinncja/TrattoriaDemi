const mongoose = require("mongoose");
const validStates = ["Upcoming", "Arrived", "Noshow", "Cancel"];
const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numGuests: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // (HH:MMam/pm format)
    required: true,
  },
  notes: {
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

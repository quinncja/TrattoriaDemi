const mongoose = require("mongoose");
const validStates = ["upcoming", "arrived", "noshow", "cancel"];
const validSizes = ["2top", "3top", "4top", "6top", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "NA"];
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
  },
  dateMade: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    default: "",
    required: false
  }
});

const logSchema = new mongoose.Schema({
  reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation"
  },
  time: {
      type: Date,
      default: Date.now,
  },
  user: {
      type: String,
      required: false
  },
  newState: {
      type: [{
        key: String,
        value: String,
      }]
  },
  oldState: {
      type: [{
        key: String,
        value: String,
      }]
  }
})
logSchema.index({ reservationId: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);
const Log = mongoose.model("Log", logSchema)

module.exports = { Reservation, Log }

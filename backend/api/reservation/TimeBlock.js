const mongoose = require("mongoose");

const timeBlockSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // hh:mm 24h
    required: true,
  },
  endTime: {
    type: String, // hh:mm 24h
    required: true,
  },
  repeat: {
    type: Boolean,
    default: false
  },
  blockType: {
    type: String,
    required: true,
  }
});
module.exports = mongoose.model("TimeBlock", timeBlockSchema);

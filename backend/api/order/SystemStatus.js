const mongoose = require("mongoose");

const systemStatusSchema = new mongoose.Schema({
  pickup: {
    type: Boolean,
    default: true,
  },
  delivery: {
    type: Boolean,
    default: true,
  },
});

const SystemStatus = mongoose.model("SystemStatus", systemStatusSchema);

module.exports = SystemStatus;

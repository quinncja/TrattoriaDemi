const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payrollSchema = new mongoose.Schema({
  period: Number,
  total: Number,
  payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
  createdDate: { 
    type: Date, 
    default: null
  },
});

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;

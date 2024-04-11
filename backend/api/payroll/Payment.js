const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
  employee: { type: Schema.Types.ObjectId, ref: "Employee" },
  fica: Number,
  state: Number,
  federal: Number,
  ilChoice: Number,
  hours: [Number],
  tips: Number,
  gross: [Number],
  net: Number,
  loan: { type: Schema.Types.ObjectId, ref: "LoanPayment" },
  rates: [Number],
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

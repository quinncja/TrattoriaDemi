const mongoose = require("mongoose");

const loanPaymentSchema = new mongoose.Schema({
  amount: Number,
  period: Number,
});

const LoanPayment = mongoose.model("LoanPayment", loanPaymentSchema);

module.exports = LoanPayment;

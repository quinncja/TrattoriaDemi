const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new mongoose.Schema({
  total: Number,
  remaining: Number,
  paymentAmount: Number,
  payments: [{ type: Schema.Types.ObjectId, ref: "LoanPayment" }],
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new mongoose.Schema({
  name: String,
  fica: Boolean,
  state: Number,
  federal: Boolean,
  ilChoice: Boolean,
  rates: [Number],
  loan: { type: Schema.Types.ObjectId, ref: "Loan" },
  tips: Boolean,
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;

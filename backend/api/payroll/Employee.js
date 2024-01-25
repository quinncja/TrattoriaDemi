const mongoose = require("mongoose")

const rateSchema = new mongoose.Schema({
    rate: Number
})
const loanSchema = new mongoose.Schema({
    amount: Number,
    payment: Number
})
const employeeSchema = new mongoose.Schema({
    name: String,
    fica: Boolean,
    state: Number,
    federal: Boolean, 
    ilChoice: Boolean,
    tips: Boolean,
    rate: [rateSchema],
    loan: loanSchema,
})

const Employee = mongoose.model("Employee", employeeSchema)
module.exports = Employee;
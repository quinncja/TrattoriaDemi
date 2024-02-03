const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Employee = require("./Employee");

const rowSchema = new mongoose.Schema({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    federalAmnt: { type: Schema.Types.Mixed, default: "" },
    ficaAmnt: { type: Schema.Types.Mixed, default: "" },
    hours: { type: Schema.Types.Mixed, default: "" },
    firstGross: { type: Schema.Types.Mixed, default: "" },
    secondHours: { type: Schema.Types.Mixed, default: "" },
    secondGross: { type: Schema.Types.Mixed, default: "" },
    gross: { type: Schema.Types.Mixed, default: "" },
    loanAmnt: { type: Schema.Types.Mixed, default: "" },
    ilChoice: { type: Schema.Types.Mixed, default: "" },
    stateAmnt: { type: Schema.Types.Mixed, default: "" },
    tips: { type: Schema.Types.Mixed, default: "" },
    tipsgross: { type: Schema.Types.Mixed, default: "" },
    netWage: { type: Schema.Types.Mixed, default: "" }
})

const payrollSchema = new mongoose.Schema({
    period: Number, 
    payrolls: [rowSchema]
})

const Payroll = mongoose.model("Payroll", payrollSchema)
module.exports = Payroll;
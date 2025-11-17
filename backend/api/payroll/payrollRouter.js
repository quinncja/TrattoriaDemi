const { authenticateToken } = require("../middleware.js");
const express = require("express");
const payrollRouter = express.Router();
const Employee = require("./Employee");
const Payroll = require("./Payroll");
const Payment = require("./Payment");
const Loan = require("./Loan");
const LoanPayment = require("./LoanPayment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = payrollRouter;

payrollRouter.put("/employee", authenticateToken, async (req, res) => {
  try {
    const { _id, loan, ...employeeData } = req.body;
    let updatedEmployee;

    if (_id) {
      updatedEmployee = await Employee.findByIdAndUpdate(_id, employeeData, {
        new: true,
      });
    } else {
      const newEmployee = new Employee(employeeData);
      updatedEmployee = await newEmployee.save();
    }

    if (loan) {
      if (loan._id) {
        await Loan.findByIdAndUpdate(loan._id, loan, { new: true });
      } else if (loan.total > 0) {
        const newLoan = new Loan({
          total: loan.total,
          remaining: loan.total,
          paymentAmount: loan.paymentAmount,
        });

        const savedLoan = await newLoan.save();

        updatedEmployee.loan = savedLoan._id;
        await updatedEmployee.save();
      }
    }

    updatedEmployee = await Employee.findById(updatedEmployee._id).populate(
      "loan",
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating employee and loan information" });
  }
});

payrollRouter.get("/employees", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find().populate("loan");
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving employee list" });
  }
});

payrollRouter.delete("/employees/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

payrollRouter.put("/employees/rate/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rates } = req.body;

  if (
    !Array.isArray(rates) ||
    !rates.every((rate) => !isNaN(parseFloat(rate)) && isFinite(rate))
  ) {
    return res.status(400).json({
      message:
        "Invalid rates array. Every item must be a number or a string that can be cast to a number.",
    });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: { rates } },
      { new: true },
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating employee rates" });
  }
});

payrollRouter.put("/employees/loan/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { total, remaining, paymentAmount } = req.body;

  try {
    let newLoan = new Loan({
      total,
      remaining,
      paymentAmount,
    });

    newLoan = await newLoan.save();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: { loan: newLoan._id } },
      { new: true },
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating employee rates" });
  }
});

payrollRouter.put("/employees/active/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res
      .status(400)
      .json({ message: "Invalid active value. It must be a boolean." });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: { active } },
      { new: true },
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating employee active status" });
  }
});

async function findPayrollByPeriod(period) {
  let payroll = await Payroll.findOne({ period }).populate({
    path: "payments",
    populate: [
      {
        path: "loan",
      },
      {
        path: "employee",
        populate: {
          path: "loan",
        },
      },
    ],
  });
  return payroll;
}

async function populatePayroll(payroll) {
  const populated = await Payroll.populate(payroll, {
    path: "payments",
    populate: [
      {
        path: "loan",
      },
      {
        path: "employee",
        populate: {
          path: "loan",
        },
      },
    ],
  });
  return populated;
}

async function makeEmptyRow(employee, period) {
  const paymentData = {
    employee: employee._id,
    fica: 0,
    state: 0,
    federal: 0,
    ilChoice: 0,
    hours: [0],
    tips: 0,
    gross: [0],
    net: 0,
    loan: undefined,
    rates: [...employee.rates],
  };

  if (employee.loan) {
    const emptyLoan = await LoanPayment.create({
      amount: 0,
      period: period,
    });
    paymentData.loan = emptyLoan._id;
  }

  return paymentData;
}

async function makeEmptyPayroll(period) {
  const employees = await Employee.find({ active: true }).populate("loan");
  const paymentsData = [];

  for (const employee of employees) {
    paymentsData.push(await makeEmptyRow(employee, period));
  }

  const payments = await Payment.insertMany(paymentsData);

  const chicagoDate = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago"
  });
  
  let newPayroll = new Payroll({
    period: period,
    payments: payments.map((payment) => payment._id),
    createdDate: new Date(chicagoDate)
  });

  newPayroll = await newPayroll.save();
  return newPayroll;
}

payrollRouter.get("/", authenticateToken, async (req, res) => {
  try {
    let { period } = req.query;

    if (!period) {
      return res.status(400).send("Period is required");
    } else period = parseFloat(period);

    let payroll = await findPayrollByPeriod(period);

    if (payroll && !payroll.total) {
      await Payroll.deleteOne(payroll);
      payroll = null;
    }

    if (!payroll) {
      payroll = await makeEmptyPayroll(period);
      payroll = await populatePayroll(payroll);
    }

    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching payroll data");
  }
});

payrollRouter.get("/all", authenticateToken, async (req, res) => {
  try {
    let payrolls = await Payroll.find();
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching payroll data");
  }
});

payrollRouter.delete("/all", authenticateToken, async (req, res) => {
  try {
    await Payroll.deleteMany();
    res.json("Delete Successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching payroll data");
  }
});

async function handleLoan(row, period) {
  let paymentId;
  const loan = await Loan.findById(row.employee.loan);
  if (!loan) return;
  else {
    const existingPayment = await LoanPayment.find({
      _id: { $in: loan.payments },
      period: period,
    });
    if (existingPayment.length > 0) {
      await LoanPayment.findByIdAndUpdate(existingPayment[0]._id, {
        amount: row.loan.amount,
      });
      paymentId = existingPayment[0]._id;
    } else {
      const newPayment = new LoanPayment({
        amount: row.loan.amount,
        period: period,
      });
      await newPayment.save();
      paymentId = newPayment._id;
      loan.payments.push(newPayment._id);
      await loan.save();
    }
  }

  const paymentDocs = await LoanPayment.find({ _id: { $in: loan.payments } });
  const totalPaid = paymentDocs.reduce(
    (acc, payment) => acc + payment.amount,
    0,
  );
  const remaining = loan.total - totalPaid;
  loan.remaining = remaining;

  await loan.save();
  return paymentId;
}

async function handleRow(row) {
  const oldRow = await Payment.findById(row._id);
  for (const key in row) {
    if (key !== "_id") {
      oldRow[key] = row[key];
    }
  }

  await oldRow.save();
  return oldRow._id;
}

async function handleRowLoan(row, loanPayment) {
  const oldRow = await Payment.findById(row._id);
  for (const key in row) {
    if (key !== "_id") {
      oldRow[key] = row[key];
    }
  }
  oldRow.loan = loanPayment;
  await oldRow.save();
  return oldRow._id;
}

async function handlePayroll(period, paymentIds, total) {
  const payroll = await Payroll.findOne({ period });
  payroll.total = total;
  payroll.payments = paymentIds;
  let newPayroll = await payroll.save();
  return newPayroll;
}

payrollRouter.post("/", authenticateToken, async (req, res) => {
  try {
    const payrollData = req.body;
    const period = payrollData.period;
    const paymentIds = [];
    const payrollTotal = payrollData.payments.reduce(
      (acc, row) => acc + row.gross[0],
      0,
    );

    for (const row of payrollData.payments) {
      let paymentId;
      if (!row.loan || row.loan.amount === 0) {
        paymentId = await handleRow(row);
      } else {
        const loanPayment = await handleLoan(row, period);
        paymentId = await handleRowLoan(row, loanPayment);
      }
      paymentIds.push(paymentId);
    }

    let returnPayroll = await handlePayroll(period, paymentIds, payrollTotal);
    returnPayroll = await populatePayroll(returnPayroll);

    res.status(201).json(returnPayroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving payroll" });
  }
});

payrollRouter.get("/graph", authenticateToken, async (req, res) => {
  try {
    const payrolls = await Payroll.find({}, "period total -_id");

    const graphData = payrolls.map((payroll) => ({
      x: payroll.period,
      y: payroll.total,
    }));

    res.json(graphData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payroll data", error: error.message });
  }
});

module.exports = payrollRouter;

payrollRouter.put("/employees/set-all-active", authenticateToken, async (req, res) => {
  try {
    const result = await Employee.updateMany({}, { $set: { active: true } });
    res.status(200).json({ message: "All employees set to active", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error setting all employees to active" });
  }
});

payrollRouter.delete("/period/:period", authenticateToken, async (req, res) => {
  let { period } = req.params;

  try {
    period = parseFloat(period);
    if (isNaN(period)) {
      return res.status(400).json({ message: "Invalid period parameter" });
    }

    const payroll = await Payroll.findOne({ period });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found for the specified period" });
    }

    await Payment.deleteMany({ _id: { $in: payroll.payments } });

    const paymentsWithLoans = await Payment.find({
      _id: { $in: payroll.payments },
      loan: { $ne: null },
    });

    const loanPaymentIds = paymentsWithLoans.map((payment) => payment.loan);

    await LoanPayment.deleteMany({ _id: { $in: loanPaymentIds } });

    await Payroll.deleteOne({ _id: payroll._id });

    res.status(200).json({ message: `Payroll for period ${period} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting payroll" });
  }
});

module.exports = payrollRouter;


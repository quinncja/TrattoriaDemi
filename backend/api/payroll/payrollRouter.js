const express = require("express");
const payrollRouter = express.Router();
const Employee = require("./Employee");
const Payroll = require("./Payroll")

payrollRouter.get("/employees", async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving employee list"});
    }
  });

  
payrollRouter.get("/", async (req, res) => {
    try {
      const { period } = req.query;

      if (!period) {
        return res.status(400).send('Period is required');
      }
  
      let payroll = await Payroll.findOne({ period: parseInt(period) }).populate('payrolls.employee');
      if (!payroll) {
        const employees = await Employee.find({});
        const newPayrolls = employees.map(emp => ({ employee: emp._id }));
  
        payroll = new Payroll({ period: parseInt(period), payrolls: newPayrolls });
        await payroll.save();
        payroll = await Payroll.findOne({ _id: payroll._id }).populate('payrolls.employee');
      }
      res.json(payroll);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching payroll data');
    }
  });

  payrollRouter.get("/all", async (req, res) => {
    try{
        let payrolls = await Payroll.find()
        res.json(payrolls)
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching payroll data');
    }
  })

  payrollRouter.delete("/all", async (req, res) => {
    try{
        await Payroll.deleteMany()
        res.json("Delete Successful")
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching payroll data');
    }
  })

  payrollRouter.post("/", async (req, res) => {
    try {
        const payrollData = req.body;
        
        await Payroll.findOneAndUpdate({period: payrollData.period}, {payrolls: payrollData.payrolls})
        res.status(201).json("Saved successfully");
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving payroll" });
    }
});

module.exports = payrollRouter;
require("dotenv").config();
const mongoose = require("mongoose");
const Loan = require("./Loan");
const Employee = require("./Employee");

const employees = [
  {
    name: "Edgar Cervantes",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    loan: { total: 775, paymentAmount: 25 },
    rates: [18.5],
  },
  {
    name: "Adam Hernandez",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: true,
    rates: [16.5],
  },
  {
    name: "Javier Magdaleno",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    rates: [12.0],
  },
  {
    name: "Juan Magdaleno",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    loan: { total: 2400, paymentAmount: 200 },
    rates: [10.0, 20.0],
  },
  {
    name: "Jesus Maltos",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    rates: [17.0],
  },
  {
    name: "Omar Montoya",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    loan: { total: 50, paymentAmount: 50 },
    rates: [19.0],
  },
  {
    name: "Rodrigo Montoya",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    loan: { total: 1600, paymentAmount: 200 },
    rates: [27.0],
  },
  {
    name: "Miguel Patino",
    fica: true,
    state: 0.4,
    federal: true,
    ilChoice: false,
    tips: true,
    rates: [10.0],
  },
  {
    name: "Rowland Stevens",
    fica: true,
    state: 0.4,
    federal: true,
    ilChoice: false,
    tips: true,
    rates: [9.5],
  },
  {
    name: "Reyes Torres",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    rates: [15.0],
  },
];

const newEmployees = [
  {
    name: "Monica Zamora",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    rates: [15.0],
  },
  {
    name: "Luis Moto",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    rates: [12.0, 16.0],
    loan: { total: 200, paymentAmount: 0 },
  },
];

const newEmployee2 = [
  {
    name: "Joiner Jarith Garth",
    fica: true,
    state: 0,
    federal: false,
    ilChoice: false,
    rates: [17.0],
  },
  {
    name: "Ryan Ohara",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    tips: true,
    rates: [9.5],
  },
];

const newEmployee3 = [
  {
    name: "Aldo Flores",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    tips: false,
    rates: [10, 15],
  },
];

const newEmployee = [
  {
    name: "Test Test",
    fica: true,
    state: 0.3,
    federal: true,
    ilChoice: false,
    tips: false,
    rates: [10, 15],
    active: true,
  },
];

const mongo_uri = process.env.MONGO_URI;

async function main() {
  try {
    await mongoose.connect(mongo_uri);
    console.log("Database connected Successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

  mongoose.connection
    .once("open", function () {
      console.log("Database connected Successfully");
    })
    .on("error", function (err) {
      console.log("Error", err);
    });

  saveEmployees();
}

async function saveEmployees() {
  try {
    for (const employeeData of newEmployee) {
      if (employeeData.loan) {
        let clonedEmployeeData = { ...employeeData };
        delete clonedEmployeeData.loan;
        const loanData = employeeData.loan;
        const loan = new Loan(loanData);
        await loan.save();

        clonedEmployeeData.loan = loan;
        const employeeWithLoan = new Employee(clonedEmployeeData);
        await employeeWithLoan.save();
      } else {
        const employee = new Employee(employeeData);
        await employee.save();
      }
    }
    console.log("All employees saved successfully");
  } catch (error) {
    console.error("Error saving employees: ", error);
  }
  process.exit(0);
}

main();

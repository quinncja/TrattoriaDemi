require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./Employee");

const employees = [
    {
        name: "Edgar Cervantes",
        fica: true,
        state: .3,
        federal: true,
        ilChoice: false,
        loan: {amount: 275, payment: 25},
        rate: [{rate: 18.50}]
    },
    {
        name: "Adam Hernandez",
        fica: true,
        state: .3,
        federal: true,
        ilChoice: true,
        rate: [{rate: 16.50}]
    },
    {
        name: "Javier Magdaleno",
        fica: true,
        state: 0,
        federal: false,
        ilChoice: false,
        rate: [{rate: 12.00}]
    },
    {
        name: "Juan Magdaleno",
        fica: true,
        state: 0,
        federal: false,
        ilChoice: false,
        loan: {amount: 2400, payment: 200},
        rate: [{rate: 10.00}, {rate: 20.00}]
    },
    {
        name: "Jesus Maltos",
        fica: true,
        state: .3,
        federal: true,
        ilChoice: false,
        rate: [{rate: 17.00}]
    },
    {
        name: "Omar Montoya",
        fica: true,
        state: .3,
        federal: true,
        ilChoice: false,
        loan: {amount: 50, payment: 50},
        rate: [{rate: 19.00}]
    },
    {
        name: "Rodrigo Montoya",
        fica: true,
        state: .3,
        federal: true,
        ilChoice: false,
        loan: {amount: 1600, payment: 200},
        rate: [{rate: 27.00}]
    },
    {
        name: "Miguel Patino",
        fica: true,
        state: .4,
        federal: true,
        ilChoice: false,
        tips: true,
        rate: [{rate: 10.00}]
    },
    {
        name: "Rowland Stevens",
        fica: true,
        state: .4,
        federal: true,
        ilChoice: false,
        tips: true,
        rate: [{rate: 9.50}]
    },
    {
        name: "Reyes Torres",
        fica: true,
        state: 0,
        federal: false,
        ilChoice: false,
        rate: [{rate: 15.00}]
    },
]
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

async function saveEmployees(){
    try {
        await Employee.deleteMany({});
        console.log("All existing employees have been deleted");

        for (const employeeData of employees) {
            const employee = new Employee(employeeData);
            await employee.save();
        }
        console.log("All employees saved successfully");
    } catch (error) {
        console.error("Error saving employees: ", error);
    }
    process.exit(0);
};

main();
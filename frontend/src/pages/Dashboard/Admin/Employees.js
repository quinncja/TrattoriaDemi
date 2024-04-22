import { useState, useEffect } from "react";
import { getEmployees } from "api";
import EmployeeCards from "./EmployeeCards";
import OpenEmployeeCard from "./OpenEmployeeCard";

function Employees() {
  const [employees, setEmployees] = useState();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      const employees = await getEmployees();
      setEmployees(employees);
    };

    loadEmployees();
  }, []);

  const handleClose = () => {
    setOpen(null);
  };

  const handleSave = (updatedEmployee) => {
    console.log("Saving employee:", updatedEmployee);
    setOpen(null);
  };

  const handleOpen = (employee) => {
    setOpen(employee);
  };

  return employees ? (
    <>
      <EmployeeCards employees={employees} handleOpen={handleOpen} />
      <OpenEmployeeCard
        employee={open}
        handleClose={handleClose}
        handleSave={handleSave}
      />
    </>
  ) : (
    <></>
  );
}

export default Employees;

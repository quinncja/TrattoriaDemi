import { useState, useEffect } from "react";
import { getEmployees } from "api";
import { motion } from "framer-motion";
import { fadeInMany } from "animations";
import EmployeeRow from "./EmployeeRow";

function Employees() {
  const [employees, setEmployees] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [shownEmployees, setShownEmployee] = useState();
  const [focused, setFocused] = useState();

  const updateEmployeeList = (newEmployee) => {
    setEmployees((prevEmployees) => {
      const employeeIndex = prevEmployees.findIndex(
        (emp) => emp._id === newEmployee._id
      );

      if (employeeIndex !== -1) {
        return prevEmployees.map((emp, index) =>
          index === employeeIndex ? newEmployee : emp
        );
      } else {
        return [...prevEmployees, newEmployee];
      }
    });
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    let employeesToShow;

    if (employees) {
      if (firstLoad) {
        employeesToShow = filterByActive(employees);
        setFirstLoad(false);
      } else {
        if (showActive) {
          employeesToShow = filterByActive(employees);
        } else {
          employeesToShow = filterByInactive(employees);
        }
      }

      setShownEmployee(employeesToShow);
      if (employeesToShow.length > 0) {
        setFocused(employeesToShow[0].name);
      }
    }
  }, [employees, showActive, firstLoad]);

  useEffect(() => {
    const loadEmployees = async () => {
      const employees = await getEmployees();
      setEmployees(employees);
    };
    loadEmployees();
  }, []);

  const filterByActive = (employees) => {
    return employees.filter((employee) => employee.active === true);
  };

  const filterByInactive = (employees) => {
    return employees.filter((employee) => employee.active === false);
  };

  return employees ? (
    <motion.div initial="hidden" animate="visible" variants={fadeInMany}>
      <div className="employees">
        <div className="employee-section-header">
          <div className="employee-header-buttons">
            <button
              onClick={() => {
                scrollToTop();
                setShowActive(true);
              }}
              className={`employee-header-btn ${!showActive && "ehb-unactive"}`}
            >
              {" "}
              <h2> Active Employees </h2>
            </button>
            <button
              onClick={() => {
                scrollToTop();
                setShowActive(false);
              }}
              className={`employee-header-btn ${showActive && "ehb-unactive"}`}
            >
              {" "}
              <h2> Inactive Employees </h2>
            </button>
          </div>
        </div>
        {shownEmployees &&
          shownEmployees.map((employee, index) => {
            return (
              <EmployeeRow
                key={employee.name}
                employee={employee}
                isFocused={focused === employee.name}
                updateEmployeeList={updateEmployeeList}
                setFocused={setFocused}
              />
            );
          })}
      </div>
    </motion.div>
  ) : (
    <></>
  );
}

export default Employees;

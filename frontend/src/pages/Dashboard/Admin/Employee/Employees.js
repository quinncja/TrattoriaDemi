import { useState, useEffect } from "react";
import { getEmployees } from "api";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInMany } from "animations";
import EmployeeRow from "./EmployeeRow";
import { plusSvg } from "svg";
import { isObject } from "lodash";

function Employees() {
  const [employees, setEmployees] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [shownEmployees, setShownEmployee] = useState();
  const [focused, setFocused] = useState();
  const [newEmpl, setNewEmpl] = useState(false);

  const beginCreateEmpl = () => {
    const newEmpl = {
      name: "",
      rates: [0, 0],
      federal: true,
      fica: true,
      ilChoice: false,
      state: 0.3,
      active: true,
    };

    setNewEmpl(newEmpl);
    setFocused("");
  };

  useEffect(() => {
    if (newEmpl && focused !== "") {
      setNewEmpl(false);
    }
    //eslint-disable-next-line
  }, [focused]);

  const updateListWithNew = (newEmployee) => {
    setEmployees((prev) => {
      const updatedEmployees = [...prev, newEmployee];

      const sortedEmployees = updatedEmployees.sort((a, b) => {
        const lastNameA = a.name.split(" ").slice(-1).join(" ");
        const lastNameB = b.name.split(" ").slice(-1).join(" ");

        return lastNameA.localeCompare(lastNameB);
      });

      return sortedEmployees;
    });

    setNewEmpl();
    setFocused(newEmployee.name);
  };

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

      const sortedEmployees = employees.sort((a, b) => {
        const lastNameA = a.name.split(" ").slice(-1).join(" ");
        const lastNameB = b.name.split(" ").slice(-1).join(" ");

        return lastNameA.localeCompare(lastNameB);
      });

      setEmployees(sortedEmployees);
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
    <div>
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
          <button
            className="new-employee-btn"
            onClick={() => beginCreateEmpl()}
          >
            {plusSvg()}
          </button>
        </div>
        <AnimatePresence>
          <motion.div
            layout
            className="employee-layout"
            initial="hidden"
            animate="visible"
            variants={fadeInMany}
          >
            {newEmpl && isObject(newEmpl) && (
              <>
                <h2> New Employee </h2>
                <EmployeeRow
                  isNew={true}
                  employee={newEmpl}
                  isFocused={focused === ""}
                  setFocused={setFocused}
                  updateEmployeeList={updateListWithNew}
                />
              </>
            )}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Employees;

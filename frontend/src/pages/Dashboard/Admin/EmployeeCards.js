import React from "react";
import { motion, LayoutGroup } from "framer-motion";

function EmployeeCards({ employees, handleOpen }) {
  function cardPopulator() {
    return (
      <div className="employee-cards">
        {employees.map((employee) => (
          <motion.button
            style={{
              borderRadius: "10px",
            }}
            key={employee._id}
            layoutId={`employee-card-${employee._id}-card`}
            className={`admin-selector employee-card`}
            onClick={() => handleOpen(employee)}
          >
            <motion.h4 layoutId={`employee-card-${employee._id}-name`}>
              {employee.name}
            </motion.h4>
          </motion.button>
        ))}
      </div>
    );
  }

  return <LayoutGroup>{cardPopulator()}</LayoutGroup>;
}

export default EmployeeCards;

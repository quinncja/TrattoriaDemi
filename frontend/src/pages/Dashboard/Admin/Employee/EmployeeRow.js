import { updateEmployee } from "api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { employeeSaveFail, employeeSaveSuccess } from "swal2";

function EmployeeRow({ employee, isFocused, setFocused, isNew, updateEmployeeList }) {
  const [employeeData, setEmployeeData] = useState({ ...employee });
  const [hasChanged, setHasChanged] = useState(false);
  const initialEmployeeDataRef = useRef(JSON.stringify(employee));

  function prepareEmployeeData(data) {
    const employeeCopy = { ...data };

    if (Array.isArray(employeeCopy.rates)) {
      employeeCopy.rates = employeeCopy.rates
        .filter((rate) => rate !== "" && rate !== "0")
        .map((rate) => Number(rate));
    }

    if (
      employeeCopy.loan &&
      employeeCopy.loan.total !== undefined &&
      employeeCopy.loan.total !== null
    ) {
      employeeCopy.loan.total = Number(employeeCopy.loan.total);
    }
    if (
      employeeCopy.loan &&
      employeeCopy.loan.paymentAmount !== undefined &&
      employeeCopy.loan.paymentAmount !== null
    ) {
      employeeCopy.loan.paymentAmount = Number(employeeCopy.loan.paymentAmount);
    }
    if (employeeCopy.state !== undefined && employeeCopy.state !== null) {
      employeeCopy.state = Number(employeeCopy.state);
    }

    return employeeCopy;
  }


  const handleSave = async () => {
    if (!hasChanged) return;
    const preparedData = prepareEmployeeData(employeeData);
    try {
      const newEmployee = await updateEmployee(preparedData);
      updateEmployeeList(newEmployee);
      initialEmployeeDataRef.current = JSON.stringify(newEmployee);
      setHasChanged(false);
      const type = isNew ? "created" : "updated";
      employeeSaveSuccess(employeeData.name, type);
    } catch (error) {
      employeeSaveFail(employeeData.name, error);
    }
  };

  useEffect(() => {
    const currentEmployeeDataJson = JSON.stringify(
      prepareEmployeeData(employeeData)
    );
    if (currentEmployeeDataJson !== initialEmployeeDataRef.current) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [employeeData]);

  function employeeInput(obj, wide) {
    return (
      <div
        className={`payroll-input-group input-group ${wide && "payroll-input-group-wide"} ${obj.type === "checkbox" && "payroll-input-group-short"} ` }
        key={`${employee.name}-${obj.text}`}
      >
        <label
          className={`input-text input-text-payroll ${
            obj.error && `input-text-error`
          }`}
        >
          {" "}
          {obj.text}{" "}
        </label>
        <div className={obj.type === "money" && obj.value ? "payroll-input-wrapper" : ""}>
          {obj.type === "checkbox" ? (
            <button
              className="employee-input-checkbox"
              onClick={() => handleInputChange(obj.path, !obj.value)}
            >
              {obj.value.toString()}
            </button>
          ) : obj.type === "save" ? (
            <button
              className={`employee-button-size submit-button ${
                !hasChanged && "inactive-submit"
              }`}
              onClick={() => handleSave()}
            >
              Save
            </button>
          ) : (
            <input
              type="text"
              id={obj.id}
              placeholder={obj.placeholder}
              className={`reserve-select reserve-select-payroll ${
                obj.inactive && `reserve-select-disabled payroll-input-inactive`
              }
                    }`}
              onChange={(event) =>
                handleInputChange(obj.path, event.target.value)
              }
              value={obj.value}
            ></input>
          )}
        </div>
      </div>
    );
  }

  function handleInputChange(path, newVal) {
    setEmployeeData((prevData) => {
      const newData = { ...prevData };
      let currentLevel = newData;

      path.slice(0, -1).forEach((key) => {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      });

      currentLevel[path[path.length - 1]] = newVal;

      return newData;
    });
  }

  function employeeBody() {
    const bodyObjs = [
      {
        text: "Salary",
        objects: [
          {
            text: "Rate 1",
            value: employeeData?.rates[0] || "",
            type: "money",
            path: ["rates", 0],
          },
          {
            text: "Rate 2",
            value: employeeData?.rates[1] || "",
            type: "money",
            path: ["rates", 1],
          },
        ],
      },
      {
        text: "Taxes",
        objects: [
          {
            text: "Federal",
            value: employeeData.federal,
            type: "checkbox",
            path: ["federal"],
          },
          {
            text: "FICA",
            value: employeeData.fica,
            type: "checkbox",
            path: ["fica"],
          },
          {
            text: "IL Choice",
            value: employeeData.ilChoice,
            type: "checkbox",
            path: ["ilChoice"],
          },
          {
            text: "State",
            value: employeeData.state,
            type: "percent",
            path: ["state"],
          },
        ],
      },
      {
        text: "Loan",
        objects: [
          {
            text: "Loan",
            value: employeeData?.loan?.total ? true : false,
            type: "checkbox",
            path: ["loan", "total"],
          },
          {
            text: "Loan Rate",
            value: employeeData?.loan?.paymentAmount || "",
            type: "money",
            path: ["loan", "paymentAmount"],
          },
        ],
      },
      {
        text: "Actions",
        objects: [
          {
            text: "Active",
            value: employeeData?.active,
            type: "checkbox",
            path: ["active"],
          },
          {
            text: "Tips",
            value: employeeData?.tips || false,
            type: "checkbox",
            path: ["tips"],
          },
          {
            text: "Overtime",
            value: employeeData?.overtime || false,
            type: "checkbox",
            path: ["overtime"],
          },
          {
            text: "Save",
            type: "save",
          },
        ],
      },
    ];
    
    return (
      <motion.div
        layout
        key={`${employee.name}-body`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 220}}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3}}
      >
        <br/>
        <div className="employee-body">
        {bodyObjs.map((obj) => (
          <div
            className="employee-row-subsection"
            key={`${employee.name}-${obj.text}`}
          >
            <div className="employee-row-subheader">{obj.text}</div>
            <div
             className="subsection-inputs">
              {obj.objects.map((object) => employeeInput(object))}
            </div>
          </div>
        ))}
        </div>
      </motion.div>
    );
  }

  const nameObj = {
    text: "Name",
    value: employeeData.name || "",
    type: "text",
    path: ["name"],
  };

  return (
    <motion.div
      layout="position"
      layoutId={`${employeeData.name}`}
      className={`employee-row ${isNew && "employee-row-bigger"} ${
        isFocused && "employee-row-focused"
      }`}
      onClick={() => setFocused(employee.name)}
    >
      <div className="row-employee">
        {isNew ? (
          <> 
            {employeeInput(nameObj, true)}
          </>
        ) : (
          employee.name
        )}
      </div> 

      <AnimatePresence mode="wait">
        {isFocused && employeeBody()}
      </AnimatePresence>
    </motion.div>
  );
}

export default EmployeeRow;
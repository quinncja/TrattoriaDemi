import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function OpenEmployeeCard({ employee, handleClose, handleSave }) {
    const [newEmployeeData, setNewEmployeeData] = useState({})

    useEffect(() => {
        setNewEmployeeData(employee);
    }, [employee]);
    
    const handleInputChange = (field, event) => {   
        event.stopPropagation()
        setNewEmployeeData(prev => ({
            ...prev,
            [field]: field === 'rate' ? [{ rate: event.target.value }] : event.target.value,
        }));
    };

    const handleToggleChange = (field, event) => {
        event.stopPropagation()
        setNewEmployeeData(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = () => {

    }


    function employeeInput(obj){
        return(
            <div className="body-row">
                <div className="employee-text">
                {obj.text}
                </div>
                <div
                value={obj.value}
                className={obj.type === "money" ? "payroll-input-wrapper" : obj.type === "percent" ? "percent-input-wrapper" : ""}> 
                    <input type={obj.type === "checkbox" ? "checkbox" : ""} className={obj.type === "checkbox" ? "employee-checkbox employee-input" : "employee-input"} value={obj.value} onChange={(e) => handleChange(obj.text, e)} />
                </div>
            </div>
        )
    }

    function employeeBody() {
        let employeeData = newEmployeeData || employee;

        const bodyObjs = [
            {
                text: "Rate",
                value: employeeData.rate[0].rate,
                type: "hours"
            },
            {
                text: "Federal",
                value: employeeData.federal,
                type: "checkbox"
            },
            {
                text: "FICA",
                value: employeeData.fica,
                type: "checkbox"
            },
            {
                text: "IL Choice",
                value: employeeData.ilChoice,
                type: "checkbox"
            },
            {
                text: "State",
                value: employeeData.state,
                type: "percent"
            },
            {
                text: "Loan Amount",
                value: employeeData?.loan?.amount,
                type: "money"
            },
            {
                text: "Loan Rate",
                value: employeeData?.loan?.payment,
                type: "money"
            },
        ]

        return(
            <div className="employee-body">
                {bodyObjs.map((obj) => {
                    return(employeeInput(obj))
                })}
            </div>
        )
    }

    return employee ? (
        <motion.div className="employee-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            layout
            key={employee._id}
            className="open-card admin-selector employee-card"
            layoutId={`employee-card-${employee._id}-card`}
            onClick={(e) => e.stopPropagation()}
            style={{
                borderRadius: '20px'
            }}
          >
            <motion.h4 layoutId={`employee-card-${employee._id}-name`} >{employee.name}</motion.h4>
            { employeeBody() }
            <button className="save-button" onClick={() => handleSave(newEmployeeData)}>Save</button>
          </motion.div>
        </motion.div>
    ) : null;
}

export default OpenEmployeeCard;
import React, { useEffect, useState } from "react";
import PayrollRow from "./PayrollRow";
import { motion } from "framer-motion";
import { fadeInMany } from "animations";

function PayrollEditor({ payrollData, currentPeriod, setNewData }) {
  const [editedData, setEditedData] = useState(payrollData);
  const [inputRefs, setInputRefs] = useState([]);
  const [currentFocus, setCurrentFocus] = useState({
    rowIndex: 0,
    refIndex: 1,
  });

  useEffect(() => {
    const createRefs = () => {
      const newRefs = payrollData.payments.map((row) => ({
        id: row.employee._id,
        refs: Array.from(
          {
            length: row.employee.rates.length > 1 || row.employee.tips ? 2 : 1,
          },
          () => React.createRef()
        ),
      }));

      setInputRefs(newRefs);
    };
    if (payrollData) createRefs();
  }, [payrollData]);

  useEffect(() => {
    inputRefs && inputRefs[0] && inputRefs[0].refs[0].current.focus();
  }, [inputRefs]);

  useEffect(() => {
    setNewData(editedData);
  }, [editedData, setNewData]);

  const handleItemChange = (index, field, value, net) => {
    setEditedData((prevData) => {
      const newData = { ...prevData };
      newData.payments[index] = {
        ...newData.payments[index],
        [field]: value,
        net: net,
      };
      return newData;
    });
  };

  const handleRowChange = (rowIndex, newRowData) => {
    setEditedData((prevData) => {
      const newData = { ...prevData };
      newData.payments[rowIndex] = {
        ...newData.payments[rowIndex],
        ...newRowData,
        employee: newData.payments[rowIndex].employee,
      };
      return newData;
    });
  };

  const changeFocus = () => {
    const { rowIndex, refIndex } = currentFocus;
    const isLastRefInRow = refIndex >= inputRefs[rowIndex].refs.length - 1;
    const isLastRow = rowIndex >= inputRefs.length - 1;

    if (isLastRefInRow) {
      if (isLastRow) {
        setCurrentFocus({ rowIndex: 0, refIndex: 0 });
        inputRefs[0].refs[0].current.focus();
      } else {
        setCurrentFocus({ rowIndex: rowIndex + 1, refIndex: 0 });
        inputRefs[rowIndex + 1].refs[0].current.focus();
      }
    } else {
      setCurrentFocus({ rowIndex, refIndex: refIndex + 1 });
      inputRefs[rowIndex].refs[refIndex + 1].current.focus();
    }
  };

  const onFocus = (rowIndex, refIndex) => {
    setCurrentFocus({ rowIndex, refIndex });
  };

  return (
    editedData &&
    editedData.payments.map((row, index) => {
      const rowRefs =
        inputRefs.find((ref) => ref.id === row.employee._id)?.refs || [];
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInMany}
          custom={index}
        >
          <PayrollRow
            isFocused={currentFocus.rowIndex === index}
            isNew={!editedData.total}
            currentPeriod={currentPeriod}
            key={row.employee._id}
            row={row}
            index={index}
            onFocus={onFocus}
            refs={rowRefs}
            changeFocus={changeFocus}
            handleRowChange={handleRowChange}
            handleItemChange={handleItemChange}
          />
        </motion.div>
      );
    })
  );
}

export default PayrollEditor;

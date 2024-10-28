import { forwardRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import PayrollInput from "components/PayrollInput";

const PayrollRow = forwardRef((props) => {
  const {
    row,
    isNew,
    index,
    refs,
    isFocused,
    onFocus,
    changeFocus,
    handleItemChange,
    handleRowChange,
  } = props;
  const { employee } = row;
  const blankValues = {
    hours: [0, 0],
    tips: 0,
    gross: [0, 0],
  };
  const blankCalculations = {
    grossDisplay: 0,
    fica: 0,
    state: 0,
    ilChoice: 0,
    net: 0,
    federal: 0,
    loan: {
      amount: 0,
    },
  };
  const [inputVals, setNewValues] = useState(isNew ? blankValues : row);

  const calcGrossArray = (arr) => {
    return Math.round((arr[0] + arr[1]) * 100) / 100;
  };

  useEffect(() => {
    if (!isNew && row) {
      setNewValues({ ...row, grossDisplay: calcGrossArray(row.gross) });
    }
  }, [isNew, row]);

  const changeItem = (field, newVal) => {
    let net;
    let value;

    if (field === "gross") {
      value = parseFloat(newVal);
      const newGross = [...inputVals.gross];
      newGross[0] = value;

      net = calcNet({
        ...inputVals,
        gross: newGross,
      });
      setNewValues({
        ...inputVals,
        gross: newGross,
        grossDisplay: newVal,
        net: net,
      });
      handleItemChange(index, field, newGross, net);
    } else {
      if (field === "loan") {
        value = { amount: newVal };
      } else {
        value = newVal;
      }
      net = calcNet({
        ...inputVals,
        [field]: value,
      });
      setNewValues({
        ...inputVals,
        [field]: value,
        net: net,
      });
      handleItemChange(index, field, value, net);
    }
  };

  const changeRow = (newRowData) => {
    handleRowChange(index, newRowData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      changeFocus();
    }
  };

  const rounder = (n, d = 2) => {
    var x = n * Math.pow(10, d);
    var r = Math.round(x);
    var br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
    return br / Math.pow(10, d);
  };

  function calcLoan(values) {
    const loanAmnt = employee.loan.paymentAmount;
    return {
      ...values,
      loan: {
        amount: loanAmnt,
      },
    };
  }

  function calcTax(values) {
    const gross = values.gross[0] + values.gross[1];
    const ficaAmnt = rounder(0.0765 * gross);
    const stateAmnt = rounder(employee.state * gross * 0.1);
    const federalAmnt = employee.federal
      ? rounder((employee.state / 2) * gross * 0.1)
      : 0;
    const ilChoice = employee.ilChoice ? rounder(gross * 0.05) : 0;

    return {
      ...values,
      fica: ficaAmnt,
      state: stateAmnt,
      federal: federalAmnt,
      ilChoice: ilChoice,
    };
  }

  function calcNet(values) {
    const netWage =
      values.gross[0] -
      values.fica -
      values.state -
      values.federal -
      (values?.loan?.amount || 0) -
      (values.ilChoice || 0);
    return rounder(netWage);
  }

  function roundOffFed(values) {
    const newNet = Math.round(values.net);
    const difference = newNet - values.net;
    const newFed = rounder(values.federal + difference);

    return {
      ...values,
      net: rounder(newNet),
      federal: rounder(newFed),
    };
  }

  function calcGrossGeneral(e) {
    const input = e.target.id;
    const value = e.target.value;

    const updatedHours = [...inputVals.hours];
    let tips = inputVals.tips || 0;

    if (input === "tips") {
      tips = value;
    } else {
      const inputNum = Number(input) - 1;
      updatedHours[inputNum] = value;
    }

    let grossWage = 0;
    for (let i = 0; i < employee.rates.length; i++) {
      grossWage += Number(updatedHours[i] || 0) * employee.rates[i];
    }

    const gross = [rounder(grossWage), Number(tips)];

    return {
      ...inputVals,
      gross: gross,
      grossDisplay: calcGrossArray(gross),
      hours: updatedHours,
      tips: tips,
    };
  }

  function calculator(e) {
    let newValues = { ...inputVals };
    newValues = calcGrossGeneral(e);

    if (newValues.gross[0] === 0 && newValues.gross[1] === 0) {
      setNewValues({ ...newValues, ...blankCalculations });
      return;
    }

    newValues = calcTax(newValues);
    if (employee.loan) newValues = calcLoan(newValues);
    newValues.net = calcNet(newValues);
    if (employee.federal) newValues = roundOffFed(newValues);
    setNewValues(newValues);
    changeRow(newValues);
  }

  return (
    <div className="payroll-row">
      {isFocused ? (
        <motion.div layoutId="background" className="row-background" />
      ) : null}
      <div className="row-employee">{employee.name}</div>
      <div className="payroll-input-row">
        <div className="input-row">
          <PayrollInput
            obj={{
              text: `${employee.overtime ? "Regular " : "Hours "} <br/> @ $${
                row.rates[0]
              }/hr`,
              id: "1",
              type: "hours",
              step: "0.01",
              placeholder: "0",
              handleChange: (e) => calculator(e),
              value: inputVals?.hours[0] || "",
              onKeyDown: (e) => handleKeyDown(e),
              onFocus: () => onFocus(index, 0),
            }}
            ref={refs[0]}
          />

          {employee.rates.length > 1 && (
            <PayrollInput
              obj={{
                text: `${employee.overtime ? "Overtime " : "Hours "} <br/> @ $${
                  row.rates[1]
                }/hr`,
                id: "2",
                type: "hours",
                step: "0.01",
                placeholder: "0",
                handleChange: (e) => calculator(e),
                onKeyDown: (e) => handleKeyDown(e),
                onFocus: () => onFocus(index, 1),
                value: inputVals?.hours[1] || "",
              }}
              ref={refs[1]}
            />
          )}
          {employee.tips && (
            <PayrollInput
              obj={{
                text: `Tips`,
                id: "tips",
                type: "tips",
                step: "0.01",
                active: true,
                placeholder: "0",
                handleChange: (e) => calculator(e),
                onKeyDown: (e) => handleKeyDown(e),
                onFocus: () => onFocus(index, 1),
                value: inputVals?.tips || "",
              }}
              ref={refs[1]}
            />
          )}
        </div>

        <div className="input-row input-row-center">
          <PayrollInput
            obj={{
              text: "Gross Wages",
              id: "gross-wages",
              active: inputVals.gross[0] ? true : false,
              onKeyDown: (e) => handleKeyDown(e),
              handleChange: (e) => changeItem("gross", e.target.value),
              onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
              value: inputVals.grossDisplay || "",
            }}
          />

          <PayrollInput
            obj={{
              text: "FICA",
              id: "fica",
              active: inputVals.gross[0] ? true : false,
              onKeyDown: (e) => handleKeyDown(e),
              handleChange: (e) => changeItem("fica", e.target.value),
              onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
              value: inputVals?.fica || "",
            }}
          />

          {employee.state !== 0 && (
            <PayrollInput
              obj={{
                text: "State Tax",
                id: "state-tax",
                active: inputVals.gross[0] ? true : false,
                onKeyDown: (e) => handleKeyDown(e),
                handleChange: (e) => changeItem("state", e.target.value),
                onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
                value: inputVals?.state || "",
              }}
            />
          )}

          {employee.federal && (
            <PayrollInput
              obj={{
                text: "Federal Tax",
                id: "federal-tax",
                active: inputVals.gross[0] ? true : false,
                onKeyDown: (e) => handleKeyDown(e),
                handleChange: (e) => changeItem("federal", e.target.value),
                onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
                value: inputVals?.federal || "",
              }}
            />
          )}

          {employee.ilChoice && (
            <PayrollInput
              obj={{
                text: "IL Secure Choice",
                id: "il-choice",
                active: inputVals.gross[0] ? true : false,
                onKeyDown: (e) => handleKeyDown(e),
                handleChange: (e) => changeItem("ilChoice", e.target.value),
                onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
                value: inputVals?.ilChoice || "",
              }}
            />
          )}

          {((isNew && employee.loan && employee.loan.total > 0) ||
            inputVals.loan) && (
            <PayrollInput
              obj={{
                text: "Loan Payment",
                id: "loan-payment",
                active: inputVals.gross[0] ? true : false,
                onKeyDown: (e) => handleKeyDown(e),
                handleChange: (e) => changeItem("loan", e.target.value),
                onFocus: () => onFocus(index, refs.length > 0 ? 1 : 0),
                value: (inputVals.grossDisplay && inputVals.loan.amount) || "",
              }}
            />
          )}
        </div>
        <div className="input-row">
          <PayrollInput
            obj={{
              text: "Net Wages",
              id: "net-wages",
              active: inputVals.gross[0] ? true : false,
              inactive: true,
              value: inputVals?.net || "",
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default PayrollRow;

import React from "react";

const PayrollInput = React.forwardRef((props, ref) => {
  const obj = props.obj;

  return (
    <div className={`payroll-input-group input-group`}>
      <label
        className={`input-text input-text-payroll ${
          obj.error && `input-text-error`
        }`}
      >
        {" "}
        {obj.text}{" "}
      </label>
      <div className={obj.active === true ? "payroll-input-wrapper" : ""}>
        <input
          type="text"
          id={obj.id}
          placeholder={obj.placeholder}
          className={`reserve-select reserve-select-payroll ${
            obj.inactive && `reserve-select-disabled payroll-input-inactive`
          }
            }`}
          onChange={(event) => obj.handleChange(event)}
          value={obj.value}
          onKeyDown={obj.onKeyDown}
          ref={ref}
          onFocus={obj.onFocus}
          disabled={obj.inactive}
        ></input>
      </div>
    </div>
  );
});

export default PayrollInput;

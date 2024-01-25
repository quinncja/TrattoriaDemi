function PayrollInput({obj}){

    return(
    <div
    className={`payroll-input-group input-group`}
    >
        <label className={`input-text input-text-payroll ${obj.error && `input-text-error`}`}>
          {" "}
          {obj.text}{" "}
        </label>
        <div className={obj.type !== "hours" ? "payroll-input-wrapper" : ""}> 
            <input
            type="text"
            id={obj.id}
            className={`reserve-select reserve-select-payroll ${
            obj.disabled && `reserve-select-disabled`
            }`}
            onChange={(event) => obj.handleChange(event)}
            value={obj.value}
        ></input>
        </div>
      </div>
    )
}

export default PayrollInput;
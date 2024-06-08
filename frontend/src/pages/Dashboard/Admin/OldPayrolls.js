import { calculateDates, formatDates } from "functions";

function OldPayrolls({ data, clickHandler }) {
  return (
    <div className="old-payrolls-wrapper">
      <div className="sticky-header"> Old Entries </div>
      <div className="old-payrolls">
      {data &&
        [...data].reverse().map((payroll, index) => {
          const originalIndex = data.length - 1 - index;
          return (
            <button
              className="old-payroll"
              key={originalIndex}
              onClick={() => clickHandler(payroll.x)}
            >
              <div>{formatDates(calculateDates(payroll.x))}</div>
              <div>{`$${payroll.y.toLocaleString()}`}</div>
            </button>
          );
        })}
        </div> 
    </div>
  );
}

export default OldPayrolls;

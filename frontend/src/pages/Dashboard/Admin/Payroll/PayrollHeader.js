import { calculateDates } from "functions";
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  cancelSvg,
  editSvg,
  leftArrow,
  printSvg,
  rightArrow,
  saveSvg,
  trashCanSvg,
} from "svg";

function PayrollHeader({
  handleClick,
  isNew,
  currentPeriod,
  editing,
  handleEdit,
  handlePrint,
  handleDelete,
}) {
  const [dates, setDates] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const clickHandler = (newPeriod) => {
    searchParams.set("period", newPeriod);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setDates(calculateDates(currentPeriod));
  }, [currentPeriod]);

  return (
    <div className="payroll-header">
      <div>
        <div className="dbn-name dbn-name-bigger">Payroll</div>
        <div className="payroll-dates">
          {dates[0]} - {dates[1]}
        </div>
      </div>
      <div className="right-row">
        {editing ? (
          <div className="button-row">
            {!isNew && (
              <button
               title="Cancel"
                className="submit-button less-height payroll-btn"
                type="button"
                onClick={handleEdit}
              >
                {" "}
                {cancelSvg()}{" "}
              </button>
            )}
            <button
              title="Save"
              className="submit-button less-height payroll-btn"
              type="button"
              onClick={handleClick}
            >
              {" "}
              {saveSvg()}{" "}
            </button>
          </div>
        ) : (
          <div className="button-row">
            <button
              title="Edit"
              className="submit-button less-height payroll-btn"
              type="button"
              onClick={handleEdit}
            >
              {" "}
              {editSvg()}{" "}
            </button>
            <button
              title="Print"
              className="submit-button less-height payroll-btn"
              type="button"
              onClick={handlePrint}
            >
              {" "}
              {printSvg()}{" "}
            </button>
            <button
              title="Delete"
              className="submit-button less-height payroll-btn"
              type="button"
              onClick={handleDelete}
            >
              {" "}
              {trashCanSvg()}{" "}
            </button>
          </div>
        )}
        <div className="payroll-date-buttons">
          <button
            className="date-changer-btn dcbb"
            onClick={
              currentPeriod > 1
                ? () => clickHandler(Number(currentPeriod) - 1)
                : () => {
                    return;
                  }
            }
          >
            {leftArrow()}
          </button>
          <button
            className="date-changer-btn dcbf"
            onClick={() => clickHandler(Number(currentPeriod) + 1)}
          >
            {rightArrow()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayrollHeader;

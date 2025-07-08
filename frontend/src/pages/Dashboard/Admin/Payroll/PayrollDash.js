import { getPayrollGraph } from "api";
import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import BackContext from "context/BackContext";
import { clockSvg, peopleSvg, prevArrow } from "svg";
import LineChart from "./LineChart";
import Swal from "sweetalert2";
import { calculateDates } from "functions";

export function PayrollDash() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setter } = useContext(BackContext);
  const [graphData, setGraphData] = useState([]);

  function cleanData(data) {
    return data.filter(
      (item) => item.hasOwnProperty("y") && typeof item.y === "number"
    );
  }

  const handlePrevClick = (period) => {
    searchParams.set("body", "payroll-editor");
    searchParams.set("period", period);
    setSearchParams(searchParams);
  }

  const clickHandler = (newPeriod) => {
    searchParams.set("body", "payroll-editor");
    searchParams.set("period", newPeriod);
    setSearchParams(searchParams);
 };

     const payrollSelectionAlert = async (period) => {
      return Swal.fire({
        title: `Create New Payroll`,
        html: `
          <div style="margin-bottom: 1.5rem;">
            <p style="margin: 0; font-size: 1rem; opacity: 0.9;">
              For period ${calculateDates(period)[0]} - ${calculateDates(period)[1]}
            </p>
          </div>
        `,
        icon: "question",
        iconColor: "#d3963a",
        padding: "2.5rem",
        background: "#151319",
        color: "#f8f4f1",
        width: "500px",
        customClass: {
          container: 'payroll-popup',
          title: "swal-header",
          confirmButton: "submit-button payroll-confirm",
          denyButton: "submit-button payroll-deny",
          htmlContainer: "swal-text-container",
        },
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: false,
        buttonsStyling: false,
        confirmButtonText: `
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>Regular Payroll</span>
          </div>
        `,
        denyButtonText: `
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>Holiday Payroll</span>
          </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true,
      }).then((result) => {
        if (result.isConfirmed) {
          searchParams.set("body", "payroll-editor");
          searchParams.set("period", period);
          setSearchParams(searchParams);
        } else if (result.isDenied) {
          searchParams.set("body", "payroll-editor");
          searchParams.set("period", period - 0.5);
          setSearchParams(searchParams);
        }
      });
    }

  const employeeHandler = () => {
    searchParams.set("body", "employees");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setter([
      {
        body: "body",
        tag: "",
      },
    ]);
  }, [setter]);

  useEffect(() => {
    const loadGraph = async () => {
      let data = await getPayrollGraph();
      data = cleanData(data);
      setGraphData(data);
    };

    loadGraph();
  }, []);

  return (
    <div className="dash-item dash-item-full">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2> Payroll </h2>
        <div className="dash-row">
          <button
            className="submit-button new-payroll edit-employees"
            onClick={() => employeeHandler()}
          >
            {peopleSvg()}
            Employees
          </button>
          <button
            className="submit-button new-payroll edit-employees"
            onClick={() => handlePrevClick(graphData.length)}
          >
            {prevArrow()}
            Previous Payroll
          </button>
          <button
            className="submit-button new-payroll"
            onClick={() => payrollSelectionAlert(graphData.length + 1)}
          >
            {clockSvg()}
            New Payroll
          </button>
        </div>
      </div>
      <div className="payroll-dash">
        <div className="graph-wrapper">
          <LineChart data={graphData} clickHandler={clickHandler} />
        </div>
      </div>
    </div>
  );
}

export default PayrollDash;

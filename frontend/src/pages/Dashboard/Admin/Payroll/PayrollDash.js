import { getPayrollGraph } from "api";
import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import BackContext from "context/BackContext";
import { clockSvg, peopleSvg } from "svg";
import LineChart from "./LineChart";

export function PayrollDash() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setter } = useContext(BackContext);
  const [graphData, setGraphData] = useState([]);

  function cleanData(data) {
    return data.filter(
      (item) => item.hasOwnProperty("y") && typeof item.y === "number"
    );
  }
  const clickHandler = (period) => {
    searchParams.set("body", "payroll-editor");
    searchParams.set("period", period);
    setSearchParams(searchParams);
  };

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
            className="submit-button new-payroll"
            onClick={() => clickHandler(graphData.length + 1)}
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

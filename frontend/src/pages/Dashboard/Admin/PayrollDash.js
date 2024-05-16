import { getPayrollGraph } from "api";
import { useSearchParams } from "react-router-dom";
import { LineGraph } from "components/Graphs";
import { useContext, useEffect, useState } from "react";
import OldPayrolls from "./OldPayrolls";
import BackContext from "context/BackContext";

export function PayrollDash() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setter } = useContext(BackContext);
  const [graphData, setGraphData] = useState([]);

  const clickHandler = (period) => {
    searchParams.set("body", "payroll-editor");
    searchParams.set("period", period);
    setSearchParams(searchParams);
  };

  const dataCleaner = (array) => {
    const filteredArray = array.filter(
      (obj) => obj.hasOwnProperty("x") && obj.hasOwnProperty("y")
    );

    filteredArray.sort((a, b) => {
      if (a.x < b.x) {
        return -1;
      }
      if (a.x > b.x) {
        return 1;
      }
      return 0;
    });

    return filteredArray;
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
      data = dataCleaner(data);
      setGraphData(data);
    };

    loadGraph();
  }, []);

  return (
    <div className="dash-wrapper">
      <div className="payroll-dash">
        <div className="graph-wrapper">
          <div className="graph-title"> Historical Data </div>
          <LineGraph data={graphData} clickHandler={clickHandler} />
        </div>
        <div className="dash-column">
          <button
            className="submit-button new-payroll"
            onClick={() => clickHandler(graphData.length + 1)}
          >
            New Payroll
          </button>
          <OldPayrolls data={graphData} clickHandler={clickHandler} />
        </div>
      </div>
    </div>
  );
}

export default PayrollDash;

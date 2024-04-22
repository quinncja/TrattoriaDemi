import { getPayrollGraph } from "api";
import { useSearchParams } from "react-router-dom";
import { LineGraph } from "components/Graphs";
import { useEffect, useState } from "react";
import OldPayrolls from "./OldPayrolls";

export function PayrollDash() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [graphData, setGraphData] = useState([]);

  const clickHandler = (period) => {
    searchParams.set("body", "payroll-editor");
    searchParams.set("period", period)
    setSearchParams(searchParams);
  };
  
  const dataCleaner = (array) => {
    return array.filter(
      (obj) => obj.hasOwnProperty("x") && obj.hasOwnProperty("y")
    );
  };

  useEffect(() => {
    const loadGraph = async () => {
      let data = await getPayrollGraph();
      data = dataCleaner(data)
      setGraphData(data);
    };

    loadGraph();
  }, []);

  return (
    <>
      <div className="payroll-dash">
        <div className="graph-wrapper">
          <div className="graph-title"> Historical Data </div>
          <LineGraph data={graphData} />
        </div>
        <div className="dash-column"> 
            <button className="submit-button" onClick={() => clickHandler(graphData.length+1)}> 
                New Payroll
            </button>
            <OldPayrolls data={graphData} clickHandler={clickHandler}/>
        </div>
      </div>
    </>
  );
}

export default PayrollDash;

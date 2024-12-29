import { ResponsiveBar } from "@nivo/bar";

function BarChart({ data }) {
  function BarTooltip({ id, color, value, indexValue }) {
    return (
      <div className="tooltip">
        <h3 style={{ textAlign: "center", fontWeight: "600" }}>
          {" "}
          Value: ${indexValue}{" "}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <span
            className="tooltip-cube"
            style={{ backgroundColor: color }}
          ></span>
          <div>Amount sold:</div> {value}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveBar
      data={data}
      keys={["count"]}
      indexBy="amount"
      margin={{ top: 30, right: 0, bottom: 20, left: -1 }}
      padding={0.3}
      colors={["#d3963add"]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Amount",
        legendPosition: "middle",
        legendOffset: 42,
        format: (item) => {
          return `$${item}`;
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number Sold",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      tooltip={({ id, color, value, indexValue }) => (
        <BarTooltip
          id={id}
          color={color}
          value={value}
          indexValue={indexValue}
        />
      )}
      labelTextColor={"white"}
      theme={{
        axis: {
          ticks: {
            line: {
              stroke: "#f8f4f1c1",
            },
            text: {
              fill: "#f8f4f1c1",
            },
          },
          domain: {
            line: {
              stroke: "#f8f4f1c1",
            },
          },
          legend: {
            text: {
              fill: "#f8f4f1c1",
            },
          },
        },
        grid: {
          line: {
            stroke: "#f8f4f1c1",
            strokeWidth: 1,
            opacity: 0.15,
          },
        },
      }}
    />
  );
}

export default BarChart;

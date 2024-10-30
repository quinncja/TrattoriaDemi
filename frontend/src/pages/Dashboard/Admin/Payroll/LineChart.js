import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { calculateDates } from "functions";
import { format } from "date-fns";

function formatStartDate(dateString) {
  const date = new Date(dateString);
  return format(date, "MMM do, yyyy");
}

function formatNumber(value) {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}k`;
  } else {
    return value.toString();
  }
}

const dataCleaner = (array) => {
  const filteredArray = array.filter(
    (obj) => obj.hasOwnProperty("x") && obj.hasOwnProperty("y")
  );

  filteredArray.sort((a, b) => a.x - b.x);

  return filteredArray;
};

function LineChart({ data, clickHandler }) {
  const cleanedData = dataCleaner(data);

  const yValues = cleanedData.map((d) => d.y);
  const yMin = Math.min(...yValues) - 1000;
  const yMax = Math.max(...yValues) + 500;

  const xValues = cleanedData.map((d) => d.x);
  const xMin = 1;
  const xMax = Math.max(...xValues);

  const xTickValues = [];
  for (let i = xMin; i <= xMax; i++) {
    xTickValues.push(i);
  }

  const nivoData = [
    {
      id: "Payroll Data",
      data: cleanedData,
    },
  ];

  return (
    <ResponsiveLine
      data={nivoData}
      margin={{ top: 5, right: 10, bottom: 70, left: 50 }}
      xScale={{ type: "linear", min: 1 }}
      yScale={{ type: "linear", min: yMin, max: yMax }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickValues: 10,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -35,
        format: (value) => {
          const dates = calculateDates(value);
          const startDate = dates.startDate || dates[0] || dates;
          return formatStartDate(startDate);
        },
        legend: "",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 5,
        format: (value) => formatNumber(value),
        legend: "",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={true}
      gridXValues={xTickValues}
      enableGridY={true}
      colors={["#d3963add"]}
      lineWidth={2}
      pointSize={7}
      pointColor="#d3963add"
      pointBorderWidth={2}
      pointBorderColor="#d3963adf"
      enableSlices="x"
      onClick={(slice) => {
        clickHandler(slice.points[0].data.x);
      }}
      sliceTooltip={({ slice }) => {
        const { points } = slice;
        const { data } = points[0];

        const dates = calculateDates(data.x);
        const startDate = dates.startDate || dates[0];
        const endDate = dates.endDate || dates[1];

        return (
          <div
            style={{
              backgroundColor: "#121212",
              borderRadius: "3px",
              padding: "15px 30px",
            }}
          >
            <div style={{ color: "#f8f4f1", fontSize: "15px" }}>
              {formatStartDate(startDate)}
            </div>
            <div style={{ color: "#f8f4f1", fontSize: "15px" }}>
              - {formatStartDate(endDate)}
            </div>

            <div
              style={{
                color: "#f8f4f1",
                fontSize: "16px",
                paddingTop: "10px",
                fontWeight: "600",
              }}
            >
              {`$${data.y.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </div>
          </div>
        );
      }}
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

export default LineChart;

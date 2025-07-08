import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { calculateDates, calculateHolidayDate, dollarFormatter } from "functions";
import { format } from "date-fns";
import "../Admin.css"

function formatStartDate(dateString) {
  const date = new Date(dateString);
  return format(date, "MMM do, yyyy");
}

function formatShortDate(dateString) {
  const date = new Date(dateString);
  return format(date, "MMM yy");
}

function formatNumber(value) {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}k`;
  } else {
    return value.toString();
  }
}

function isHolidayPeriod(period) {
  return period % 1 !== 0;
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
  for (let i = xMin; i <= xMax; i += 3) {
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
      margin={{ top: 50, right: 35, bottom: 35, left: 65 }}
      xScale={{ type: "linear", min: 1 }}
      yScale={{ type: "linear", min: yMin, max: yMax }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 12,
        tickRotation: 0,
        tickValues: xTickValues,
        legendOffset: 36,
        legendPosition: "middle",
        format: (value) => {
          const dates = calculateDates(value);
          const startDate = dates.startDate || dates[0] || dates;
          return formatShortDate(startDate);
        },
      }}
      axisLeft={{
        orient: "left",
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        tickValues: 6,
        legendOffset: -40,
        legendPosition: "middle",
        format: (value) => `${formatNumber(value)}`,
      }}
      enableGridX={false}
      enableGridY={true}
      gridYValues={5}
      colors={["#d3963add"]}
      lineWidth={3}
      enableArea={true}
      areaOpacity={0.2}
      areaBaselineValue={yMin}
      curve="catmullRom"
      pointSize={6}
      pointColor="#ffffff"
      pointBorderWidth={2}
      pointBorderColor="#d3963adf"
      layers={[
        'grid',
        'markers',
        'axes',
        'areas',
        'crosshair',
        'lines',
        ({ points }) => (
          <g key="custom-points">
            {points.map((point) => {
              const isHoliday = isHolidayPeriod(point.data.x);
              return (
                <circle
                  key={point.id}
                  cx={point.x}
                  cy={point.y}
                  r={2.5}
                  fill={isHoliday ? "#ffffff" : "#ffffff"}
                  stroke={isHoliday ? "#0fa446" : "#d3963adf"}
                  strokeWidth={2}
                />
              );
            })}
          </g>
        ),
        'slices',
        'mesh',
        'legends'
      ]}
      enableSlices="x"
      tooltip={() => null}
      sliceTooltip={({ slice }) => {
        const { points } = slice;
        const { data } = points[0];
        const isHoliday = isHolidayPeriod(data.x);
        
        if (isHoliday) {
          return (
            <div className="tooltip" style={{ minWidth: "220px" }}>
              <h4 style={{ color: "#0fa446", fontWeight: 600, margin: '0px'}}>
                Holiday Payroll
              </h4>
              <div style={{ color: "#ffffff", fontSize: "14px", margin: "0px", opacity: ".8" }}>
                {calculateHolidayDate(data.x)}
              </div>
              <div
                style={{
                  color: "#0fa446",
                  fontSize: "16px",
                  paddingTop: "10px",
                  fontWeight: "600",
                }}
              >
                {dollarFormatter(data.y)}
              </div>
            </div>
          );
        } else {
          const dates = calculateDates(data.x);
          const startDate = dates.startDate || dates[0];
          const endDate = dates.endDate || dates[1];
          
          return (
            <div className="tooltip" style={{ minWidth: "220px" }}>
              <h4 style={{fontWeight: 600, margin: '0px' }}>
                Payroll
              </h4>
              <h5 style={{ margin: '0px', fontWeight: '500', opacity: ".8"}}>{formatStartDate(startDate)}
                {"  "} - {formatStartDate(endDate)}
              </h5>
              <div
                style={{
                  color: "#d3963a",
                  fontSize: "16px",
                  margin: '0px',
                  paddingTop: "10px",
                  fontWeight: 600
                }}
              >
                {dollarFormatter(data.y)}
              </div>
            </div>
          );
        }
      }}
      onClick={(slice) => {
        clickHandler(slice.points[0].data.x);
      }}
      theme={{
        background: "transparent",
        text: {
          fontSize: 12,
          fill: "#586069",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        axis: {
          domain: {
            line: {
              stroke: "transparent",
              strokeWidth: 0,
            },
          },
          legend: {
            text: {
              fontSize: 13,
              fill: "#24292e",
              fontWeight: 500,
            },
          },
          ticks: {
            line: {
              strokeWidth: 1,
            },
            text: {
              fontSize: 12,
              fill: "#acadae",
              fontWeight: 500,
            },
          },
        },
        grid: {
          line: {
            stroke: "#acadae",
            strokeOpacity: 0.2,
          },
        },
        tooltip: {
          container: {
            zIndex: 9999,
          },
        },
        crosshair: {
          line: {
            stroke: "#acadae",
            strokeWidth: 1,
            strokeOpacity: 0.5,
          },
        },
      }}
      animate={true}
      motionConfig={{
        mass: 1,
        tension: 120,
        friction: 14,
        clamp: false,
        precision: 0.01,
        velocity: 0,
      }}
      enableCrosshair={true}
      crosshairType="x"
      useMesh={true}
    />
  );
}

export default LineChart;
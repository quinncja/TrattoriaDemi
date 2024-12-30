import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { dateToString, dateToMonthYear, dateToShortString, dateTimeToString } from "dateUtils";

function LineChart({ data, view }) {

  const strToDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date
  }

  const fullStrToDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date
  }


  const weekMonthProps = {
    axisBottom: {
      tickSize: 5,
      tickPadding: 10,
      tickRotation: 15,
      tickValues:
        view === "week"
          ? data[0].data.map((d) => d.x)
          : view === "year" ?
          data[0]?.data.filter((_, index) => index % 4 === 0).map((d) => d.x)
          : data[0]?.data.filter((_, index) => index % 2 === 0).map((d) => d.x),
      format: (value) => {
        return dateToShortString(fullStrToDate(value));
      },
    },
  };

  const yearAllProps = {
    axisBottom: {
      tickValues: 10,
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 15,
      format: (value) => {
        return dateToMonthYear(strToDate(value));
      },
    },
  };

  const propsToUse =
    view === "allTime"
      ? yearAllProps 
      : weekMonthProps;

  const CustomTooltip = ({ slice }) => {
    console.log(slice.points[0].data.x)
    const formatId = (id) => {
      if (id === "arrUp") return "Reservations";
      if (id === "cancel") return "Cancelled";
      if (id === "noshow") return "No show";
    };

    return (
      <div
        className="tooltip"
        style={{ minWidth: "160px", padding: "10px 15px" }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: "600",
            paddingBottom: "6px",
          }}
        >
          {view === "allTime" 
            ? dateToMonthYear(strToDate(slice.points[0].data.x)) :
            dateToString(fullStrToDate(slice.points[0].data.x))}
        </h3>
        {slice.points.map((point) => (
          <div
            key={point.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <span
                className="tooltip-cube"
                style={{ backgroundColor: point.color }}
              ></span>
              <span className="text-sm">{formatId(point.serieId)}:</span>
            </div>
            <span className="text-sm font-medium">{point.data.y}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 20, bottom: 40, left: 30 }}
      axisTop={null}
      colors={["#d3963add", "#a09c9c", "#c64949"]}
      lineWidth={2}
      legend
      curve="monotoneX"
      pointSize={7}
      pointBorderWidth={2}
      enableSlices="x"
      sliceTooltip={CustomTooltip}
      {...propsToUse}
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

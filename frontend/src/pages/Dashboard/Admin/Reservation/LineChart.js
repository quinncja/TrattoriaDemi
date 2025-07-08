import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { dateToString, dateToMonthYear, dateToShortString, dateTimeToString } from "dateUtils";

function LineChart({ data, view }) {
  const strToDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    // For monthly data, use the 15th to avoid timezone edge cases
    const date = new Date(Date.UTC(year, month - 1, 15));
    return date;
  };

  const fullStrToDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    // Use UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month - 1, day));
    return date;
  };

  // Helper function to determine if we're dealing with monthly or daily data
  const isMonthlyData = (dateStr) => {
    return dateStr.split('-').length === 2; // YYYY-MM format
  };

  // Props for daily data (today, week, month views)
  const dailyProps = {
    axisBottom: {
      tickSize: 5,
      tickPadding: 10,
      tickRotation: 15,
      tickValues: (() => {
        if (!data[0]?.data?.length) return [];
        
        if (view === "week") {
          return data[0].data.map((d) => d.x);
        } else if (view === "month") {
          // Show every 2nd day for month view
          return data[0].data.filter((_, index) => index % 2 === 0).map((d) => d.x);
        } else if (view === "today") {
          // Show all data points for today (likely just one)
          return data[0].data.map((d) => d.x);
        }
        return data[0].data.map((d) => d.x);
      })(),
      format: (value) => {
        return dateToShortString(fullStrToDate(value));
      },
    },
  };

  // Props for monthly data (year, allTime views)
  const monthlyProps = {
    axisBottom: {
      tickSize: 5,
      tickPadding: 10,
      tickRotation: 15,
      tickValues: (() => {
        if (!data[0]?.data?.length) return [];
        
        if (view === "year") {
          // Show every 2nd month for year view
          return data[0].data.filter((_, index) => index % 2 === 0).map((d) => d.x);
        } else if (view === "allTime") {
          // For allTime, show fewer ticks to avoid crowding
          const dataLength = data[0].data.length;
          const interval = Math.max(1, Math.floor(dataLength / 8)); // Show ~8 ticks max
          return data[0].data.filter((_, index) => index % interval === 0).map((d) => d.x);
        }
        return data[0].data.map((d) => d.x);
      })(),
      format: (value) => {
        return dateToMonthYear(strToDate(value));
      },
    },
  };

  // Determine which props to use based on data format
  const propsToUse = (() => {
    if (!data[0]?.data?.length) return dailyProps;
    
    const firstDataPoint = data[0].data[0].x;
    const hasMonthlyData = isMonthlyData(firstDataPoint);
    
    return hasMonthlyData ? monthlyProps : dailyProps;
  })();

  const CustomTooltip = ({ slice }) => {
    console.log(slice.points[0].data.x);
    
    const formatId = (id) => {
      if (id === "arrUp") return "Reservations";
      if (id === "cancel") return "Cancelled";
      if (id === "noshow") return "No show";
      return id;
    };

    const formatTooltipDate = (dateStr) => {
      if (isMonthlyData(dateStr)) {
        return dateToMonthYear(strToDate(dateStr));
      } else {
        return dateToString(fullStrToDate(dateStr));
      }
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
          {formatTooltipDate(slice.points[0].data.x)}
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
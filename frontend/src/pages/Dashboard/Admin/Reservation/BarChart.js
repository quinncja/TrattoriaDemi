import { ResponsiveBar } from "@nivo/bar";
import BarTooltip from "./BarTooltip";

function BarChart({ data }) {
  console.log(data);

  return (
    <ResponsiveBar
      data={data}
      keys={["arrUp", "noshow", "cancel"]}
      indexBy="numGuests"
      margin={{ top: 22, right: 0, bottom: 20, left: 0 }}
      padding={0.15}
      innerPadding={3}
      colors={["#d3963add", "#a09c9c", "#c64949"]}
      groupMode="stacked"
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 42,
        format: (item) => {
          return `${item}`;
        },
      }}
      labelSkipHeight={"9"}
      borderRadius="1"
      axisLeft={false}
      labelTextColor={"white"}
      isInteractive={true}
      tooltip={({ id, color, value, indexValue }) => (
        <BarTooltip
          id={id}
          color={color}
          value={value}
          indexValue={indexValue}
        />
      )}
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

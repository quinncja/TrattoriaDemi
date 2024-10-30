import { ResponsiveBar } from "@nivo/bar";

function BarChart({ data }) {
  console.log(data);

  return (
    <ResponsiveBar
      data={data}
      keys={["count"]}
      indexBy="numGuests"
      margin={{ top: 30, right: 50, bottom: 50, left: 60 }}
      padding={0.3}
      colors={["#d3963add"]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Party Size",
        legendPosition: "middle",
        legendOffset: 42,
        format: (item) => {
          return `${item}`;
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Parties",
        legendPosition: "middle",
        legendOffset: -40,
      }}
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

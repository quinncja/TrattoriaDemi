import { calculateDates, formatDates } from "functions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#121212",
  borderRadius: "3px",
  border: "none",
};
export function LineGraph({ data, clickHandler }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        onClick={(e) => clickHandler(e.activeLabel)}
      >
        <XAxis dataKey="x" tick={{ fill: "#f8f4f1c1" }} stroke="#f8f4f1c1" />
        <YAxis domain={["dataMin - 500", "dataMax + 500"]} hide />
        <Tooltip
          position={{ x: 29, y: 0 }}
          offset="5"
          separator=""
          labelFormatter={(l) => formatDates(calculateDates(l))}
          formatter={(value) => {
            return [
              `$${value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              "",
            ];
          }}
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#f8f4f1", fontSize: "16px" }}
          itemStyle={{ color: "#f8f4f1", fontSize: "16px" }}
        />
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="y"
          stroke="#d3963add"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

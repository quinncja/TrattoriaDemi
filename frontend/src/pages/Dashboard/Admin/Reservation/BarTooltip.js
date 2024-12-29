function BarTooltip({ id, color, value, indexValue }) {
  const formatId = (id) => {
    if (id === "arrUp") return "Reservations";
    if (id === "cancel") return "Cancelled";
    if (id === "noshow") return "No shows";
  };
  return (
    <div className="tooltip">
      <h3 style={{ textAlign: "center", fontWeight: "600" }}>
        {" "}
        {indexValue} Top{" "}
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
        <div>{formatId(id)}:</div> {value}
      </div>
    </div>
  );
}
export default BarTooltip;

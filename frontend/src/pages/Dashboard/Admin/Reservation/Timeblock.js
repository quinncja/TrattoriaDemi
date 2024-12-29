import { dateToMonth, dateToString } from "dateUtils";
import { convertTo12Hour } from "functions";

function TimeBlock({ item, editBlock }) {
  const { date, startTime, endTime, blockType, repeat } = item;

  const hourOptions = [
    "11:30am",
    "11:45am",
    "12:00pm",
    "12:15pm",
    "12:30pm",
    "12:45pm",
    "1:00pm",
    "1:15pm",
    "1:30pm",
    "1:45pm",
    "2:00pm",
    "2:15pm",
    "2:30pm",
    "2:45pm",
    "3:00pm",
    "3:15pm",
    "3:30pm",
    "3:45pm",
    "4:00pm",
    "4:15pm",
    "4:30pm",
    "4:45pm",
    "5:00pm",
    "5:15pm",
    "5:30pm",
    "5:45pm",
    "6:00pm",
    "6:15pm",
    "6:30pm",
    "6:45pm",
    "7:00pm",
    "7:15pm",
    "7:30pm",
    "7:45pm",
    "8:00pm",
    "8:15pm",
    "8:30pm",
    "8:45pm",
    "9:00pm",
  ];

  const normalizedStart = convertTo12Hour(startTime);
  const normalizedEnd = convertTo12Hour(endTime);

  const isAllDay =
    normalizedStart === hourOptions[0] &&
    normalizedEnd === hourOptions[hourOptions.length - 1];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "14px",
        gap: "20px",
        boxSizing: "border-box",
      }}
      className="timeblock"
      onClick={() => editBlock(item)}
    >
      <div className={blockType === "Open" ? "green" : "red"}>
        {" "}
        {blockType === "Open" ? "O" : "C"}{" "}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "7px",
          width: "90%",
        }}
      >
        <h3 style={{ fontWeight: "600" }}>
          {" "}
          {repeat ? dateToMonth(new Date(date)) : dateToString(new Date(date))}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              opacity: 0.8,
            }}
          >
            {isAllDay ? (
              <label> All day </label>
            ) : (
              <>
                <label> {normalizedStart}</label> -
                <label> {normalizedEnd}</label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeBlock;

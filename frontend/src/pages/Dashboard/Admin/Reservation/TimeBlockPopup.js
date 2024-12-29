import { convertTo12Hour, convertTo24Hour } from "functions";
import { useState } from "react";

function TimeBlockPopup({
  editingBlock,
  submitBlock,
  updateBlock,
  deleteBlock,
  closeSelf,
}) {
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

  const normalizedStart = convertTo12Hour(editingBlock.startTime);
  const normalizedEnd = convertTo12Hour(editingBlock.endTime);

  const isAllDay =
    normalizedStart === hourOptions[0] &&
    normalizedEnd === hourOptions[hourOptions.length - 1];

  const editing = editingBlock.editing;
  const [date, setDate] = useState(
    editingBlock.date
      ? new Date(editingBlock.date).toISOString().split("T")[0]
      : null
  );
  const [startTime, setStartTime] = useState(editingBlock.startTime);
  const [endTime, setEndTime] = useState(editingBlock.endTime);
  const [allDay, setallDay] = useState(isAllDay);
  const [repeat, setRepeat] = useState(editingBlock.repeat);
  const [type, setType] = useState(editingBlock.blockType);

  const handleUpdate = () => {
    const dateArr = date.split("-");
    const newDate = new Date(
      Number(dateArr[0]),
      Number(dateArr[1]) - 1,
      Number(dateArr[2])
    );

    const updatedBlock = {
      date: newDate,
      startTime: allDay ? convertTo24Hour(hourOptions[0]) : startTime,
      endTime: allDay
        ? convertTo24Hour(hourOptions[hourOptions.length - 1])
        : endTime,
      repeat,
      blockType: type,
    };

    updateBlock(editingBlock._id, updatedBlock);
  };

  const handleSubmit = () => {
    const dateArr = date.split("-");
    const newDate = new Date(
      Number(dateArr[0]),
      Number(dateArr[1]) - 1,
      Number(dateArr[2])
    );

    const newBlock = {
      date: newDate,
      startTime: allDay ? convertTo24Hour(hourOptions[0]) : startTime,
      endTime: allDay
        ? convertTo24Hour(hourOptions[hourOptions.length - 1])
        : endTime,
      repeat,
      blockType: type,
    };
    submitBlock(newBlock);
  };
  const handleChange = (event) => {
    if (event.target.id === "date") {
      console.log(event.target.value);
      setDate(event.target.value);
    }

    if (event.target.id === "startTime") {
      setallDay(false);
      setStartTime(event.target.value);
    }

    if (event.target.id === "endTime") {
      setallDay(false);
      setEndTime(event.target.value);
    }
    if (event.target.id === "repeat") {
      setRepeat(!repeat);
    }
  };

  return (
    <div className="popup-wrapper" onClick={() => closeSelf()}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2> {editing ? "Edit" : "New"} Timeblock</h2>

        <div className="time-block-form-body">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "25px",
              alignItems: " last baseline",
            }}
          >
            <div className="input-group">
              <label> Date </label>
              <input
                layout="position"
                style={{ background: "none" }}
                className={`new-res-input  ${!date && "new-res-unselect"}`}
                id="date"
                type="date"
                value={date}
                onChange={(event) => handleChange(event)}
              />
            </div>
            <div className="input-group">
              <label> Type </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: " last baseline",
                }}
              >
                <button
                  style={{
                    width: "50%",
                    opacity: type === "Open" ? 1 : type === "Closed" ? 0.3 : 1,
                  }}
                  className={`time-block-button ${
                    type === "Open" ? "active-time-button" : ""
                  }`}
                  onClick={() => setType("Open")}
                >
                  Open
                </button>
                <button
                  style={{
                    width: "50%",
                    opacity: type === "Closed" ? 1 : type === "Open" ? 0.3 : 1,
                  }}
                  className={`time-block-button ${
                    type === "Closed" ? "active-time-button" : ""
                  }`}
                  onClick={() => setType("Closed")}
                >
                  Closed
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: " last baseline",
              opacity: type === null ? 0.2 : 1,
            }}
          >
            <div className="input-group" style={{ width: "150px" }}>
              <button
                style={{ opacity: allDay ? 1 : startTime ? 0.3 : 1 }}
                className={`time-block-button ${
                  allDay ? "active-time-button" : ""
                }`}
                onClick={() => setallDay(!allDay)}
              >
                {type} All Day
              </button>
            </div>
            <span
              style={{
                paddingInline: "15px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {" "}
              or{" "}
            </span>
            <div className="input-group">
              <select
                layout="position"
                className={`new-res-input  ${!startTime && "new-res-unselect"}`}
                id="startTime"
                style={{ background: "none", opacity: allDay ? 0.3 : 1 }}
                onChange={(event) => handleChange(event)}
                value={allDay ? "" : startTime || "Time"}
              >
                <option default hidden value="" key={"default"}>
                  Start time
                </option>
                {hourOptions.map((hour, index) => (
                  <option value={convertTo24Hour(hour)} data={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <span> to </span>
            <div className="input-group" style={{ width: "150px" }}>
              <label> </label>
              <select
                layout="position"
                style={{ background: "none", opacity: allDay ? 0.3 : 1 }}
                className={`new-res-input  ${!startTime && "new-res-unselect"}`}
                id="endTime"
                onChange={(event) => handleChange(event)}
                value={allDay ? "" : endTime || "Time"}
              >
                <option default hidden value="" key={"default"}>
                  End time
                </option>
                {hourOptions.map((hour, index) => (
                  <option value={convertTo24Hour(hour)} data={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <input
              type="checkbox"
              id="repeat"
              name="repeat"
              checked={repeat}
              onClick={(event) => handleChange(event)}
            />
            <label for="repeat" style={{ fontSize: "16px" }}>
              {" "}
              Repeat annually?{" "}
            </label>
          </div>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <button className="submit-button" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="submit-button edit-employees "
                style={{ width: "29%" }}
                onClick={() => deleteBlock(editingBlock._id)}
              >
                Delete
              </button>
            </div>
          ) : (
            <button className="submit-button " onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeBlockPopup;

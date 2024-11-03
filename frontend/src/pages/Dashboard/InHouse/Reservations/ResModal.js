import { useState } from "react";
import { openBookSvg } from "svg";
import { dateToString } from "dateUtils";
import { convertTo12Hour, convertTo24Hour } from "functions";

function ResModal(props) {
  const { res, selfClose, updateRes } = props;

  const [numGuests, setGuests] = useState(res.numGuests || null);
  const [date, setDate] = useState(new Date(res.date) || null);
  const [time, setTime] = useState(convertTo12Hour(res.time) || null);

  const handleUpdate = () => {
    const updatedRes = {
        ...res,
        numGuests,
        date,
        time: convertTo24Hour(time),
    }
    updateRes(updatedRes)
  }
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
    "8:30PM",
    "8:45PM",
    "9:00PM",
  ];

  const handleChange = (event) => {
    if (event.target.id === "date") {
      setDate(event.target.valueAsDate);
    }
    if (event.target.id === "guests") {
      setGuests(event.target.selectedIndex);
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
    }
  };

  const guestLabel = (num) => {
    if (num === 1) return "1 guest"
    else return `${num} guests`
  }
  return (
    <>
      <div
        className="res-modal-background"
        onClick={(e) => {
          e.stopPropagation();
          selfClose();
        }}
      />
      <div className="res-modal-container">
        <h2> Edit Reservation </h2>

        <div className="new-res-input-group">
          <label className="new-res-label"> {openBookSvg()} Table Info</label>

          <label className="date-label"> {guestLabel(numGuests)} </label>
          <select
            className={`new-res-input  ${!numGuests && "new-res-unselect"}`}
            id="guests"
            onChange={(event) => handleChange(event)}
          >
            <option default hidden value="">
              {" "}
              Party Size{" "}
            </option>
            <option> 1 guest </option>
            {[...Array(29)].map((_, index) => (
              <option data={index + 2} key={index + 2}>
                {index + 2} guests
              </option>
            ))}
          </select>

          <label className="date-label" htmlFor="date">
            {" "}
            {date ? dateToString(date) : "Date"}{" "}
          </label>
          <input
            className={`new-res-input  ${!date && "new-res-unselect"}`}
            id="date"
            type="date"
            onChange={(event) => handleChange(event)}
          />

            <label className="date-label" htmlFor="time"> {time} </label>
          <select
            className={`new-res-input  ${!time && "new-res-unselect"}`}
            id="time"
            onChange={(event) => handleChange(event)}
          >
            <option default hidden value="">
              {" "}
              Time{" "}
            </option>
            {hourOptions.map((hour, index) => (
              <option data={hour} key={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        <button className="submit-button submit-new-res" onClick={handleUpdate}>
          {" "}
          Update Reservation{" "}
        </button>
      </div>
    </>
  );
}

export default ResModal;

import { useEffect, useState } from "react";
import { openBookSvg } from "svg";
import { dateToString } from "dateUtils";
import { convertTo12Hour, convertTo24Hour } from "functions";
import { fadeInModal } from "animations";
import { motion } from "framer-motion";
import { getTimeListByDate } from "api";
import { toast } from "sonner";
import PinEntry from "./PinEntry";

function ResModal(props) {
  const { res, selfClose, updateRes } = props;

  const [employee, setEmployee] = useState(null);
  const name = res.name;
  const [numGuests, setGuests] = useState(res.numGuests || null);
  const [date, setDate] = useState(new Date(res.date) || null);
  const [time, setTime] = useState(convertTo12Hour(res.time) || null);

  const [timeList, setTimeList] = useState(["Loading"]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    const loadTimeList = async () => {
      try {
        const data = await getTimeListByDate(formatDate(date));
        setTimeList(data);
      } catch (error) {
        toast.error("Failed to load timelist");
      }
    };

    loadTimeList();
  }, [date]);

  const handleUpdate = () => {
    const updatedRes = {
      ...res,
      numGuests,
      date,
      employee,
      tableSize: tableSizes[numGuests][0],
      time: convertTo24Hour(time),
    };
    updateRes(updatedRes);
  };

  const tableSizes = {
    1: ["2top"],
    2: ["2top", "3top"],
    3: ["3top", "4top"],
    4: ["4top", "6top"],
    5: ["6top"],
    6: ["6top"],
    7: ["6top"],
    8: ["xl"],
    9: ["xl"],
    10: ["xl"],
    11: ["2xl"],
    12: ["2xl"],
    13: ["2xl"],
    14: ["2xl"],
    15: ["3xl"],
    16: ["3xl"],
    17: ["3xl"],
    18: ["3xl"],
    19: ["4xl"],
    20: ["4xl"],
    21: ["5xl"],
    22: ["5xl"],
    23: ["5xl"],
    24: ["5xl"],
    25: ["6xl"],
    26: ["6xl"],
    27: ["6xl"],
    28: ["6xl"],
    29: ["6xl"],
    30: ["6xl"],
  };

  const handleChange = (event) => {
    if (event.target.id === "date") {
      const dateArr = event.target.value.split("-");
      const newDate = new Date(
        Number(dateArr[0]),
        Number(dateArr[1]) - 1,
        Number(dateArr[2])
      );
      setDate(newDate);
    }
    if (event.target.id === "guests") {
      setGuests(event.target.selectedIndex);
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
    }
  };

  const guestLabel = (num) => {
    if (num === 1) return "1 guest";
    else return `${num} guests`;
  };

  const closeModalButton = () => {
    return (
      <button
        onClick={() => selfClose()}
        type="button"
        className="new-res-btn2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 -2 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const resModalBody = () => {
    return(
      <motion.div className="res-modal-container" {...fadeInModal}>
        <div className="res-modal-header">
          <div style={{display: 'flex', flexDirection: 'column', gap: "5px"}}> 
          <div style={{ fontSize: "1.8rem", fontWeight: "600" }}>
            {" "}
            Edit Reservation{" "}
          </div>
          <div>
            For {name}
          </div>
          </div>
          {closeModalButton()}
        </div>
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
          <motion.div>
            <motion.label
              layout="position"
              className="date-label"
              htmlFor="date"
            >
              {" "}
              {date ? dateToString(date) : "Date"}{" "}
            </motion.label>
            <motion.input
              layout="position"
              className={`new-res-input  ${!date && "new-res-unselect"}`}
              id="date"
              type="date"
              onChange={(event) => handleChange(event)}
            />
          </motion.div>

          <label className="date-label" htmlFor="time">
            {" "}
            {time}{" "}
          </label>
          <select
            className={`new-res-input  ${!time && "new-res-unselect"}`}
            id="time"
            onChange={(event) => handleChange(event)}
          >
            <option default hidden value="">
              {" "}
              {timeList.length > 0 ? "Time" : "No available times"}{" "}
            </option>
            {timeList.map((hour, index) => (
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
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        className="res-modal-background"
        onClick={(e) => {
          e.stopPropagation();
          selfClose();
        }}
        {...fadeInModal}
      />
      {!employee ?
        <PinEntry setEmployee={setEmployee} text={"To update the reservation"}/>
      : resModalBody()
      }
    </>
  );
}

export default ResModal;

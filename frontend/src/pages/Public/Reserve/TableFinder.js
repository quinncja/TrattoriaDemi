import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { convertTo24Hour, convertTo12Hour, dateToString } from "functions";
import { checkReservation } from "api";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInDown } from "animations";
import Dropdown from "components/Dropdown";
import { Calendar } from 'primereact/calendar';
import { calendarSvg, peopleSvg, clockSvg } from "svg";
import { convertDateToIso } from "functions";

const TableFinder = forwardRef((props, ref) => {
  const { table, setTable, editing, setEditing } = props;
  console.log(table)
  const [numGuests, setGuests] = useState(table?.numGuests || null);
  const [date, setDate] = useState(table?.date || null);
  const [time, setTime] = useState(table?.time || "");
  const [timeList, setTimeList] = useState(null);
  const [availableTimes, setAvailableTimes] = useState(null);
  const [calOpen, setCalOpen] = useState(false);
  const calendarRef = useRef(null);

  const reset = () => {
    setGuests(null);
    setDate("");
    setTime("");
    setTimeList("");
    setAvailableTimes(null);
  };

  useImperativeHandle(ref, () => ({
    reset,
  }));

  const times = {
    mon_thur: [
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
    ],
    fri_sat: [
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
      "9:15pm",
      "9:30pm",
    ],
    sun: [
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
    ],
  };

  const days = {
    0: "sun",
    1: "mon_thur",
    2: "mon_thur",
    3: "mon_thur",
    4: "mon_thur",
    5: "fri_sat",
    6: "fri_sat",
  };

  const inputText = {
    guestNum: "Party Size",
    dateTxt: "Date",
    timeTxt: "Time",
    button:
      time &&
      availableTimes &&
      `${convertTo12Hour(time)} is not available. Select an alternative time`,
  };

  const getTimeList = (date) => {
    const newDate = new Date(date);
    const dayOfWeek = newDate.getDay();
    const timeKey = days[dayOfWeek];
    const tL = times[timeKey];
    const convertedTimeList = tL.map((time) => ({
      label: time,
      value: convertTo24Hour(time),
    }));
    setTimeList(convertedTimeList);
  };

  const handleTimeClick = (buttonId) => {
    const [btnTime, btnTable] = buttonId.split("-");
    setTable({
      numGuests,
      date,
      time: btnTime,
      tableSize: btnTable,
    });
    setEditing(false);
  };

  const getTimeButtons = (list) => {
    return list.map((obj, index) => (
      <button
        className={`reserve-button`}
        key={index}
        id={`${obj.time}-${obj.table}`}
        type="button"
        onClick={(event) => {
          handleTimeClick(event.target.id);
        }}
      >
        {convertTo12Hour(obj.time)}
      </button>
    ));
  };

  const handleDateChange = (value) => {
    console.log(value)
    setTime("");
    setAvailableTimes(null);
    setDate(value);
    getTimeList(value);
  };

  const handleChange = (event) => {
    if (event.target.id === "guests") {
      setGuests(event.target.value);
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
    }
  };

  function balancedTrim(array) {
    const desiredLength = 5;

    if (array.length <= desiredLength) return array;

    const totalToRemove = array.length - desiredLength;
    const removeFromStart = Math.floor(totalToRemove / 2);
    const removeFromEnd = totalToRemove - removeFromStart;

    return array.slice(removeFromStart, array.length - removeFromEnd);
  }

  function sortResponse(array) {
    array.sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);

      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      } else {
        return timeA[1] - timeB[1];
      }
    });
    return array;
  }

  useEffect(() => {
    if (editing && date?.$d) {
      getTimeList(date.$d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    function handleResponse(response) {
      if (response.available) {
        setAvailableTimes(null);
        setTable({
          numGuests,
          date,
          time: response.available.time,
          tableSize: response.available.table,
        });
        setEditing(false);
      } else {
        setTable(null);
        let times = sortResponse(response.suggestions);
        times = balancedTrim(times);
        setAvailableTimes(times);
      }
    }

    const fetchChecker = async () => {
      try {
        const response = await checkReservation(
          numGuests,
          convertDateToIso(date.$d),
          time,
          signal
        );
        handleResponse(response);
      } catch (error) {
        console.error("Error checking reservation", error);
      }
    };
    if (numGuests && date && time) fetchChecker();

    return () => {
      abortController.abort();
    };
  }, [numGuests, date, time, setTable, setEditing]);

  const guestOptions = {
    name: "Party Size",
    options: [
      { value: 1, label: "1 guest" },
      ...[...Array(5)].map((_, index) => ({
        value: index + 2,
        label: `${index + 2} guests`,
      })),
      {
        value: "",
        label: "For parties exceeding 6 guests please call the restaurant",
        disabled: true,
      },
    ],
  };

  const ButtonField = () => {
    return (
      <button
        type="button"
        className={`date-picker ${calOpen ? "date-picker-open" : ""}`}
        onClick={() => setCalOpen((prev) => !prev)}
      >
        {calendarSvg()}
        {date ? `${dateToString(date)}` : "Select"}
      </button>
    );
  };

  const datePicker = () => {
    return(
      <div className="calendar-wrapper"> 
      <Calendar
        value={date}
        onChange={(e) => handleDateChange(e.value)}
        visible={calOpen}
        onVisibleChange={(e) => setCalOpen(e.visible)}
        closeOnSelect={true}
        minDate={new Date()}
        inline="true"
      />
    </div>
    )
  }
  return (
    <div className="table-finder-container">
      <AnimatePresence>
        <motion.div {...fadeIn} className={`table-finder`}>
          <div className="input-group" layoutId="guest-outline">
            <div className={`input-text`}> {inputText.guestNum} </div>
            <Dropdown
              object={guestOptions}
              selected={numGuests}
              onSelect={handleChange}
              id={"guests"}
              svg={peopleSvg}
              layoutId={"guest-outline"}
            />
          </div>
          <div className="input-group">
            <span id="date" className={`input-text ${calOpen ? "gold" : ""}`}>
              {" "}
              {inputText.dateTxt}{" "}
            </span>
            <ButtonField />
            {calOpen && datePicker()}
          </div>
          <div className="input-group">
            <div className="input-text"> {inputText.timeTxt} </div>
            <Dropdown
              object={{ name: "Time", options: timeList }}
              selected={time}
              onSelect={handleChange}
              id={"time"}
              svg={clockSvg}
              layoutId={"time-outline"}
            />
          </div>
        </motion.div>
        {availableTimes && (
          <AnimatePresence>
            <motion.div {...fadeInDown}>
              <label className="input-text"> {inputText.button} </label>
              <div className="reserve-buttons">
                {getTimeButtons(availableTimes)}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
});

export default TableFinder;

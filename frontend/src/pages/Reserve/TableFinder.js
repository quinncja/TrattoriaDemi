import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { convertTo24Hour, convertTo12Hour, dateToString } from "../../functions";
import { checkReservation } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

const TableFinder = forwardRef((props, ref) => {
  const { table, setTable } = props;
  const [numGuests, setGuests] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState("")
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [realTime, setRealTime] = useState(null);
  const [timeList, setTimeList] = useState(null);
  const [availableTimes, setAvailableTimes] = useState(null);

  const reset = () => {
    setGuests(null)
    setSelectedGuest("")
    setDate("")
    setTime("")
    setRealTime("")
    setTimeList("")
    setAvailableTimes(null)
  }

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
    setTimeList(times[timeKey]);
  };

  const handleTimeClick = (buttonId) => {
    const [btnTime, btnTable] = buttonId.split("-");
    setTable({
        numGuests,
        date,
        time: btnTime,
        tableSize: btnTable,
    });
    setRealTime(btnTime);
    }

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

  const handleChange = (event) => {
    if (event.target.id === "guests") {
      setGuests(event.target.selectedIndex);
      setSelectedGuest(event.target.value)
    }
    if (event.target.id === "date") {
      setTime('')
      setAvailableTimes(null)
      setDate(event.target.value);
      getTimeList(event.target.value);
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
    const abortController = new AbortController();
    const signal = abortController.signal;

    function handleResponse(response) {
      if (response.available) {
        setRealTime(response.available.time);
        setAvailableTimes(null);
        setTable({
          numGuests,
          date,
          time: response.available.time,
          tableSize: response.available.table,
        });
      } else {
        setTable(null)
        setRealTime(null);
        let times = sortResponse(response.suggestions);
        times = balancedTrim(times);
        setAvailableTimes(times);
      }
    }

    const fetchChecker = async () => {
      try {
        const response = await checkReservation(numGuests, date, time, signal);
        handleResponse(response);
      } catch (error) {
        console.error("Error checking reservation", error);
      }
    };
    if (numGuests && date && time) fetchChecker();

    return () => {
      abortController.abort();
    };
  }, [numGuests, date, time, setTable]);

  const calendarSvg = () => {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 2V6" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2V6" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 10H21" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  }

  const peopleSvg = () => {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  }

  const clockSvg = () => {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12L16 14" stroke="#2d2d34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
  }

  return (
    <div className="table-finder-container">
        {table ?
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
            <div className="input-text"> Your table </div>
            <div className="found-table">
                <div className="table-info">
                    {peopleSvg()}
                    {numGuests}
                </div>
                <div className="table-info">
                    {calendarSvg()}
                    {dateToString(date)}
                </div>
                <div className="table-info">
                    {clockSvg()}
                    {convertTo12Hour(realTime)}
                </div>
                <button className="edit-btn" type="button" onClick={() => setTable(null)}>
                    Edit
                </button>
                </div>
            </motion.div>
        </AnimatePresence>
        : 
        <> 
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`table-finder`}>
        <div className="input-group">
          <div className={`input-text`}> {inputText.guestNum} </div>
          <select
            className={`reserve-select`}
            onChange={(event) => handleChange(event)}
            id="guests"
            value={selectedGuest}
          >
            <option default hidden value="">
              {" "}
              Select{" "}
            </option>
            <option>1 guest</option>
            {[...Array(9)].map((_, index) => (
              <option data={index + 2} key={index + 2}>
                {index + 2} guests
              </option>
            ))}
            <option disabled value="">
              For parties exceding 10 guests please call the restaurant
            </option>
          </select>
        </div>
        <div className="input-group">
          <span id="date" className="input-text">
            {" "}
            {inputText.dateTxt}{" "}
          </span>

          <input
            onChange={(event) => handleChange(event)}
            type="date"
            id="date"
            className={`reserve-select`}
            value={date}
          />
        </div>
        <div className="input-group">
          <div className="input-text"> {inputText.timeTxt} </div>
          <select
            className={`reserve-select`}
            id="time"
            onChange={(event) => handleChange(event)}
            value={time}
          >
            <option default hidden value="">
              {" "}
              Select{" "}
            </option>
            {date && timeList ? (
              timeList.map((time, index) => (
                <option key={index} value={convertTo24Hour(time)}>
                  {time}
                </option>
              ))
            ) : (
              <option disabled value="">
                Select a date first
              </option>
            )}
          </select>
        </div>
      </motion.div>
      {availableTimes && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <label className="input-text"> {inputText.button} </label>
            <div className="reserve-buttons">
              {getTimeButtons(availableTimes)}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
              </>
        }
    </div>
  );
});

export default TableFinder;

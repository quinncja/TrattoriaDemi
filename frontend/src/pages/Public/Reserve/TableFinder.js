import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { convertTo24Hour, convertTo12Hour } from "functions";
import { checkReservation } from "api";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInDown, fadeInModal } from "animations";
import Dropdown from "components/Dropdown";
import { Calendar } from "primereact/calendar";
import { calendarSvg, peopleSvg, clockSvg, cancelSvg } from "svg";
import { dateToString } from "dateUtils";
import { TZDate } from "@date-fns/tz";

const TableFinder = forwardRef((props, ref) => {
  const { table, setTable, editing, setEditing } = props;
  const [numGuests, setGuests] = useState(table?.numGuests || null);
  const [date, setDate] = useState(table?.date ? new Date(table?.date) : null);
  const [time, setTime] = useState(table?.time || "");
  const [timeList, setTimeList] = useState(null);
  const [availableTimes, setAvailableTimes] = useState(null);
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef();
  const [isMobile, setMobile] = useState(false);
  const [errorChecking, setErrorChecking] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 675) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      "8:30pm",
      "8:45pm",
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

  const half_day = [
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
  ]

  const inputText = {
    guestNum: "Party Size",
    dateTxt: "Date",
    timeTxt: "Time",
    button:
      time &&
      availableTimes && availableTimes.length > 0 ? 
      `${convertTo12Hour(time)} is not available. Select an alternative time` 
      : `${convertTo12Hour(time)} is not available. Please call us at 847-332-2330 to reserve a table.` 
  };

  const getTimeList = (date) => {
    const isSpecialDate = date.getFullYear() === 2024 &&
                          date.getMonth() === 10 &&
                          date.getDate() === 29 &&
                          date.getDay() === 5; 
    console.log(date, isSpecialDate)
    let tL;
    if (isSpecialDate) {
      tL = half_day;
    } else {
      const dayOfWeek = date.getDay();
      const timeKey = days[dayOfWeek];
      tL = times[timeKey];
    }
                    

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    let filteredTL = tL;

    if (isToday) {
      const nowPlus30 = new Date(now.getTime() + 30 * 60000);

      filteredTL = tL.filter((time) => {
        const { hours, minutes } = parseTimeString(time);
        const timeDate = new Date(date);
        timeDate.setHours(hours);
        timeDate.setMinutes(minutes);
        timeDate.setSeconds(0);
        timeDate.setMilliseconds(0);
        return timeDate >= nowPlus30;
      });
    }

    const convertedTimeList = filteredTL.map((time) => ({
      label: time,
      value: convertTo24Hour(time),
    }));
    setTimeList(convertedTimeList);
  };

  const parseTimeString = (timeString) => {
    if (!timeString) return { hours: 0, minutes: 0 };
    const regex = /^(\d{1,2}):(\d{2})(am|pm)$/;
    const match = timeString.match(regex);

    if (!match) {
      return { hours: 0, minutes: 0 };
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3];

    if (modifier === "pm" && hours !== 12) {
      hours += 12;
    } else if (modifier === "am" && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
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
    const year = value.getFullYear();
    const month = (value.getMonth()).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');
    
    const timeZone = 'America/Chicago';
    const chicagoDate = new TZDate(year, month, day, timeZone);
    setTime("");
    setAvailableTimes(null);
    setDate(chicagoDate);
    getTimeList(chicagoDate);
    setCalOpen(false);
  };

  const handleOverlayClick = () => {
    if (isMobile) setCalOpen(false);
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
    if (editing && date) {
      getTimeList(date);
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
        console.log(numGuests, date, time)

        const response = await checkReservation(numGuests, date, time, signal);
        handleResponse(response);
      } catch (error) {
        setErrorChecking(true);
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

  const handleClickOutside = (event) => {
    if (calRef.current && !calRef.current.contains(event.target)) {
      setCalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ButtonField = () => {
    return (
      <>
        <button
          type="button"
          className={`date-picker ${calOpen ? "date-picker-open" : ""}`}
          onClick={() => openCal((prev) => !prev)}
        >
          {calendarSvg()}
          {date ? `${dateToString(date)}` : "Select"}
        </button>
        {calOpen && !isMobile && <div className="extended-button" />}
      </>
    );
  };

  const openCal = () => {
    if (isMobile) document.body.classList.toggle("no-scroll", true);
    setCalOpen(true);
  };
  const disabledDates = [new Date(2024, 10, 28), new Date(2024, 11, 25)];
  
  function DatePicker() {
    return (
      <motion.div
        ref={calRef}
        className={`calendar-wrapper-${isMobile ? "disabled" : "enabled"}`}
        onClick={isMobile ? () => {} : () => handleOverlayClick()}
        {...(isMobile ? fadeInModal : {})}
      >
        {isMobile && (
          <div className="dropdown-header cal-header">
            <div style={{ width: "30px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {calendarSvg()} Select a Date
            </div>
            <button
              className="dropdown-header-button"
              onClick={() => setCalOpen(false)}
            >
              {cancelSvg()}
            </button>
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          <Calendar
            value={date}
            onChange={(e) => handleDateChange(e.value)}
            visible={calOpen}
            onVisibleChange={(e) => setCalOpen(e.visible)}
            minDate={new Date()}
            inline="true"
            touchUI={isMobile}
            disabledDates={disabledDates}
          />
        </div>
      </motion.div>
    );
  }
  return (
    <div className="table-finder-container">
      <AnimatePresence>
        <motion.div {...fadeIn} className={`table-finder`}>
          <div className="input-group">
            <div className={`input-text`}> {inputText.guestNum} </div>
            <Dropdown
              object={guestOptions}
              selected={numGuests}
              onSelect={handleChange}
              id={"guests"}
              svg={peopleSvg}
              layoutId={"guest-outline"}
              isMobile={isMobile}
            />
          </div>
          <div className="input-group">
            <span id="date" className={`input-text ${calOpen ? "gold" : ""}`}>
              {" "}
              {inputText.dateTxt}{" "}
            </span>
            <ButtonField />
            {calOpen && <DatePicker />}
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
              isMobile={isMobile}
            />
          </div>
        </motion.div>
        {errorChecking && (
          <AnimatePresence>
            <motion.div {...fadeInDown}>
              <label className="input-text"> {inputText.button} </label>
              <div className="reserve-fail">
                There was an error fetching available tables, please refresh and
                try again. <br />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
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

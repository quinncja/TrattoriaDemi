import React, { useState, useEffect } from "react";
import FancyLine from "../../images/FancyLine.png";
import "./Reserve.css";
import PhoneInput from "react-phone-number-input/input";
import { checkReservation, postReservation } from "../../api";
import { successfulReserveAlert } from "../../swal2";

export default function Reserve() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [numGuests, setGuests] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [realTime, setRealTime] = useState(null);
  const [tableSize, setTableSize] = useState(null);
  const [notes, setNotes] = useState(null);
  const [phone, setPhone] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeList, setTimeList] = useState(null);
  const [errorStates, setError] = useState({
    fname: false,
    lname: false,
    guest: false,
    date: false,
    time: false,
    phone: false,
    realTime: false,
    button: false,
  });

  const getNextSevenDays = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const CHICAGO_OFFSET_HOURS = -5; // Chicago is UTC-5

    const upcomingDates = [];

    for (let i = 0; i < 8; i++) {
      const currentDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      currentDate.setUTCHours(currentDate.getUTCHours() + CHICAGO_OFFSET_HOURS);

      const dateOnlyString = currentDate.toISOString().split("T")[0];
      const dayName = days[currentDate.getUTCDay()];
      const monthName = months[currentDate.getUTCMonth()];
      const day = currentDate.getUTCDate();

      upcomingDates.push({
        label: `${dayName}, ${monthName} ${day}`,
        date: dateOnlyString,
      });
    }

    return upcomingDates;
  };

  const dates = getNextSevenDays();

  const inputText = {
    fname: errorStates.fname ? "Enter your first name" : "First Name",
    lname: errorStates.lname ? "Enter your last name" : "Last Name",
    guestNum: errorStates.guest ? "Select your party size" : "Number of Guests",
    dateTxt: errorStates.date ? "Choose a date" : "Date",
    timeTxt: errorStates.time ? "Choose a time" : "Time",
    phone: errorStates.phone ? "Enter your phone number" : "Phone Number",
    button: errorStates.button
      ? `${convertTo12Hour(time)} is not available. Select an alternative time`
      : availableTimes.length > 0
      ? `Closest available times`
      : `Available!`,
    message: "Message to recipient",
    eta: "",
  };

  function convertTo24Hour(time) {
    let [hours, minutes] = time.split(/[:\s]/);
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (time.toLowerCase().includes("pm") && hours !== 12) {
      hours += 12;
    }

    if (time.toLowerCase().includes("am") && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
  function convertTo12Hour(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    let period = "am";
    if (hours >= 12) {
      period = "pm";
    }

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  }

  const onSubmit = () => {
    if (!reserveValidator()) createRes();
  };

  const reserveValidator = () => {
    let isError = false;
    if (!firstName) {
      setError((errorStates) => ({ ...errorStates, fname: true }));
      isError = true;
    }
    if (!lastName) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, lname: true }));
    }
    if (!numGuests) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, guest: true }));
    }
    if (!date) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, date: true }));
    }
    if (!time) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, time: true }));
    }
    if (!phone) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, phone: true }));
    }
    if (availableTimes.length > 0 && !realTime) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, button: true }));
    }
    return isError;
  };

  function clearForm() {
    document.getElementById("res-form").reset();
    setFirstName(null);
    setLastName(null);
    setGuests(null);
    setDate(null);
    setTime(0);
    setNotes(null);
    setPhone(null);
    setAvailableTimes([]);
    setActiveButton(null);
    setRealTime(null);
    setTableSize(null);
  }

  async function createRes() {
    const newRes = {
      name: `${firstName.trimEnd()} ${lastName.trimEnd()}`,
      numGuests,
      date,
      time: realTime,
      notes,
      sendText: true,
      phone,
      tableSize,
    };

    const status = await postReservation(newRes);
    if (status === 201) {
      clearForm();
      successfulReserveAlert();
    } else console.log(status);
  }

  const handleChange = (event) => {
    if (event.target.id === "fname") {
      setError((errorStates) => ({ ...errorStates, fname: false }));
      setFirstName(event.target.value);
    }
    if (event.target.id === "lname") {
      setError((errorStates) => ({ ...errorStates, lname: false }));
      setLastName(event.target.value);
    }
    if (event.target.id === "guests") {
      setError((errorStates) => ({ ...errorStates, guest: false }));
      setGuests(event.target.selectedIndex);
    }
    if (event.target.id === "date") {
      setDate(event.target.value);
      setError((errorStates) => ({ ...errorStates, date: false }));
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
      setError((errorStates) => ({ ...errorStates, time: false }));
    }
    if (event.target.id === "notes") {
      setNotes(event.target.value);
    }
  };

  const handleClick = (buttonId) => {
    setError((errorStates) => ({ ...errorStates, button: false }));
    const [time, table] = buttonId.split("-");
    if (activeButton)
      document.getElementById(activeButton).className = "reserve-button";
    if (activeButton !== buttonId) {
      document.getElementById(buttonId).className =
        "reserve-button reserve-button-active";
      setRealTime(time);
      setTableSize(table);
    }
    if (activeButton === buttonId) {
      setActiveButton(null);
      setRealTime(null);
      setTableSize(null);
    } else setActiveButton(buttonId);
  };

  function getButtons(list) {
    return list.map((obj, index) => (
      <button
        className={`reserve-button ${
          activeButton === obj.time && "reserve-button-active"
        }`}
        key={index}
        id={`${obj.time}-${obj.table}`}
        type="button"
        onClick={(event) => {
          handleClick(event.target.id);
        }}
      >
        {convertTo12Hour(obj.time)}
      </button>
    ));
  }

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
    if (date) {
      const newDate = new Date(date);
      const dayOfWeek = newDate.getDay();
      const timeKey = days[dayOfWeek];
      setTimeList(times[timeKey]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    function handleResponse(response) {
      if (response.available) {
        setRealTime(response.available.time);
        setTableSize(response.available.table);
        setAvailableTimes([]);
      } else {
        setActiveButton(null)
        setRealTime(null);
        setTableSize(null);
        let times = sortResponse(response.suggestions);
        times = balancedTrim(times);
        console.log(times)
        setAvailableTimes(times);
      }
    }

    const fetchChecker = async () => {
      try {
        const response = await checkReservation(numGuests, date, time);
        handleResponse(response);
      } catch (error) {
        console.error("Error checking reservation", error);
      }
    };
    if (numGuests && date && time) fetchChecker();
  }, [numGuests, date, time]);

  return (
    <form id="res-form">
      <div className="reserve-top">
        Reserve a table below or by phone at 847-332-2330
      </div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">For a Reservation</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div
            className={`reserve-inputs ${
              availableTimes.length > 0 && "reserve-inputs-expanded"
            }`}
          >
            <div className="input-fname input-group">
              <label
                className={`input-text ${
                  errorStates.fname && `input-text-error`
                }`}
              >
                {" "}
                {inputText.fname}{" "}
              </label>
              <input
                type="text"
                id="fname"
                className={`reserve-select ${
                  errorStates.fname && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
              ></input>
            </div>

            <div className="input-lname input-group">
              <div
                id="lName"
                className={`input-text ${
                  errorStates.lname && `input-text-error`
                }`}
              >
                {" "}
                {inputText.lname}{" "}
              </div>
              <input
                type="text"
                id="lname"
                className={`reserve-select ${
                  errorStates.lname && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
              ></input>
            </div>

            <div className="input-size input-group">
              <div
                className={`input-text ${
                  errorStates.guest && `input-text-error`
                }`}
              >
                {" "}
                {inputText.guestNum}{" "}
              </div>
              <select
                className={`reserve-select ${
                  errorStates.guest && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
                id="guests"
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
            <div className="input-date input-group">
              <span
                id="date"
                className={`input-text ${
                  errorStates.date && `input-text-error`
                }`}
              >
                {" "}
                {inputText.dateTxt}{" "}
              </span>

              <select
                onChange={(event) => handleChange(event)}
                type="date"
                id="date"
                className={`reserve-select ${
                  errorStates.date && `reserve-select-error`
                }`}
              >
                <option default hidden value="">
                  {" "}
                  Select{" "}
                </option>
                {numGuests ? (
                  <>
                    {dates.map((obj, index) => (
                      <option key={index} value={obj.date}>
                        {obj.label}
                      </option>
                    ))}
                    <option disabled>
                      Reservations can be made 7 days in advance
                    </option>
                  </>
                ) : (
                  <option disabled value="">
                    Select number of guests first
                  </option>
                )}
              </select>
            </div>
            <div className="input-time input-group">
              <div
                className={`input-text  ${
                  errorStates.time && `input-text-error`
                }`}
              >
                {" "}
                {inputText.timeTxt}{" "}
              </div>
              <select
                className={`reserve-select ${
                  errorStates.time && `reserve-select-error`
                }`}
                id="time"
                onChange={(event) => handleChange(event)}
              >
                <option default hidden value="">
                  {" "}
                  Select{" "}
                </option>
                {timeList ? (
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
            <div
              className={`other-times-wrapper  ${
                errorStates.button && "reserve-select-error"
              }`}
            >
              <div className={`input-other-times`}>
                <label
                  className={`input-text ${
                    errorStates.button && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.button}{" "}
                </label>
                <div className="reserve-buttons">
                  {getButtons(availableTimes)}
                </div>
              </div>
            </div>

            <div className="input-notes input-group">
              <div className="input-text"> Additional Notes? </div>
              <textarea
                type="text"
                placeholder="Optional"
                className="reserve-select input-text-area"
                id="notes"
                onChange={(event) => handleChange(event)}
              ></textarea>
            </div>

            <div className="input-email-submit input-group">
              <div className="input-group">
                <div
                  className={`input-text ${
                    errorStates.phone && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.phone}{" "}
                </div>
                <PhoneInput
                  country="US"
                  withCountryCallingCode={true}
                  className={`reserve-select ${
                    errorStates.phone && `reserve-select-error`
                  }`}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event);
                    setError((errorStates) => ({
                      ...errorStates,
                      phone: false,
                    }));
                  }}
                />
              </div>

              <div className="phone-checkbox">
                <div className="reserve-small-text">
                  {" "}
                  You will receive a confirmation text upon reservation{" "}
                </div>
              </div>

              <button
                className="submit-button"
                type="button"
                onClick={onSubmit}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

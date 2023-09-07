import React, { useState } from "react";
import FancyLine from "../../images/FancyLine.png";
import "./Reserve.css";
import { getReservationsByDate, postReservation } from "../../api";

export default function Reserve() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [numGuests, setGuests] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(0);
  const [notes, setNotes] = useState(null);
  const [availableTimes, setAvailableTimes] = useState(null);
  const [errorStates, setError] = useState({
    fname: false,
    lname: false,
    guest: false,
    date: false,
    time: false,
  });

  const inputText = {
    fname: errorStates.fname ? "Please enter your first name" : "First Name",
    lname: errorStates.lname ? "Please enter your last name" : "Last Name",
    guestNum: errorStates.guest
      ? "Please select your party size"
      : "Number of Guests",
    dateTxt: errorStates.date ? "Please choose a date" : "Date",
    timeTxt: errorStates.time ? "Please choose a time" : "Time",
  };

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
  }

  async function createRes() {
    const newRes = {
      name: `${firstName.trimEnd()} ${lastName.trimEnd()}`,
      numGuests,
      date,
      time,
      notes,
    };
    const status = await postReservation(newRes);
    if (status === 201) {
      clearForm();
    } else console.log(status);
  }

  async function getAvailableRes(date) {
    const reservations = await getReservationsByDate(date);
    const dateObj = new Date(date);
    const dayOfWeek = days[dateObj.getDay()];

    const availableTimes = times[dayOfWeek].filter((time) => {
      return !reservations.some((reservation) => reservation.time === time);
    });

    setAvailableTimes(availableTimes);
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
      setGuests(
        event.target.options[event.target.selectedIndex].getAttribute("data")
      );
    }
    if (event.target.id === "date") {
      getAvailableRes(event.target.value);
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
    6: "sun",
    0: "mon_thur",
    1: "mon_thur",
    2: "mon_thur",
    3: "mon_thur",
    4: "fri_sat",
    5: "fri_sat",
  };

  return (
    <form id="res-form">
      <div className="reserve-top">
        Reserve a table below or by phone at 847-332-2330
      </div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">For a Reservation</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div className="reserve-inputs">
            <div className="input-group input-fname">
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
            <div className="input-group input-lname">
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
            <div className="bottom-left-grid">
              <div className="input-group">
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
                  <option default hidden>
                    {" "}
                    Select{" "}
                  </option>
                  <option>1 guest</option>
                  {[...Array(9)].map((_, index) => (
                    <option data={index + 2} key={index + 2}>
                      {index + 2} guests
                    </option>
                  ))}
                  <option disabled>
                    For parties exceding 10 guests please call the restaurant
                  </option>
                </select>
              </div>
              <div className="input-group">
                <span
                  id="date"
                  className={`input-text ${
                    errorStates.date && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.dateTxt}{" "}
                </span>
                <input
                  type="date"
                  id="date"
                  className={`reserve-select ${
                    errorStates.date && `reserve-select-error`
                  }`}
                  onChange={(event) => handleChange(event)}
                  min={new Date().toISOString().split("T")[0]}
                ></input>
              </div>
              <div className="input-group">
                <div
                  className={`input-text ${!availableTimes && "disabled"} ${
                    errorStates.time && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.timeTxt}{" "}
                </div>
                {availableTimes ? (
                  <select
                    className={`reserve-select ${
                      errorStates.time && `reserve-select-error`
                    }`}
                    value={time}
                    id="time"
                    onChange={(event) => handleChange(event)}
                  >
                    <option default hidden>
                      {" "}
                      Select an available time{" "}
                    </option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className={`reserve-select disabled-select ${
                      errorStates.time && `reserve-select-error`
                    }`}
                    disabled
                  >
                    <option>Awaiting date selection </option>
                  </select>
                )}
              </div>
            </div>
            <div className="bottom-right-grid">
              <div className="input-group">
                <div className="input-text"> Additional Notes? </div>
                <textarea
                  type="text"
                  placeholder="Optional"
                  className="reserve-select input-text-area"
                  id="notes"
                  onChange={(event) => handleChange(event)}
                ></textarea>
              </div>

              <button
                className="submit-button"
                type="button"
                onClick={onSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

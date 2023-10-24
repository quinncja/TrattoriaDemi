import React from "react";

function ReservationHeader(props) {
  const { date, setDate, numGuests, numRes } = props;

  function dateToString(date) {
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

    const dateAsObj = new Date(date);
    const dayName = days[dateAsObj.getUTCDay()];
    const monthName = months[dateAsObj.getUTCMonth()];
    const day = dateAsObj.getUTCDate();

    return `${dayName}, ${monthName} ${day}`;
  }
  function dateChanger() {
    const buttonClick = (id) => {
      const dateAsObj = new Date(date);

      if (id === "back") {
        dateAsObj.setDate(dateAsObj.getDate() - 1);
      }
      if (id === "forward") {
        dateAsObj.setDate(dateAsObj.getDate() + 1);
      }

      setDate(dateAsObj.toISOString());
    };
    return (
      <div className="date-changer-container">
        <button
          className="date-changer-btn dcbb"
          id="back"
          onClick={(event) => buttonClick(event.target.id)}
        >
          <svg
            id="back"
            className="svg"
            width="24"
            height="24"
            viewBox="3 3 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="date-changer-text"> {dateToString(date)} </div>
        <button
          className="date-changer-btn dcbf"
          id="forward"
          onClick={(event) => buttonClick(event.target.id)}
        >
          <svg
            width="24"
            className="svg"
            id="forward"
            height="24"
            viewBox="2 3 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }
  function numResDisplay() {
    return (
      <div className="res-amount res-amount-header">
        {numRes}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  function numGuestDisplay() {
    return (
      <div className="res-amount res-amount-header">
        {numGuests}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <>
      <div className="res-amounts">
        {numResDisplay()}
        {numGuestDisplay()}
      </div>
      {dateChanger()}
    </>
  );
}

export default ReservationHeader;

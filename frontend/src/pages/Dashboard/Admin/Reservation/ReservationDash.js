import { getReservationsData } from "api";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";

function ReservationDash() {
  const [currentChart, setCurrent] = useState("today");
  const [data, setData] = useState({
    today: null,
    month: null,
    year: null,
  });

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await getReservationsData();
      console.log(loadedData);
      setData(loadedData);
    };

    loadData();
  }, []);

  const filterObjs = [
    {
      text: "Today",
      id: "today",
    },
    {
      text: "Month",
      id: "month",
    },
    {
      text: "Year",
      id: "year",
    },
  ];

  const filterButtons = () => {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
        {filterObjs.map((obj) => {
          return (
            <button
              onClick={() => setCurrent(obj.id)}
              className={`filter-button ${
                currentChart === obj.id && "active-filter-button"
              }`}
            >
              {obj.text}
            </button>
          );
        })}
      </div>
    );
  };

  const numberBoxes = () => {
    return (
      <div
        className="number-boxes"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: "6px",
          paddingRight: "6px",
        }}
      >
        <div className="res-amount res-amount-header admin-res-amount">
          {data[currentChart].reservationCount}
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
        <div className="res-amount res-amount-header admin-res-amount">
          {data[currentChart].totalGuests}
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
      </div>
    );
  };

  const topBar = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          height: "30px",
          justifyContent: "space-between",
          paddingTop: "5px",
        }}
      >
        {filterButtons()}
        {numberBoxes()}
      </div>
    );
  };

  return (
    <div className="dash-item">
      <div>
        <h2> Reservations </h2>
        {data[currentChart] && topBar()}
        <div className="bar-wrapper">
          {data[currentChart] && (
            <BarChart data={data[currentChart].guestCounts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationDash;

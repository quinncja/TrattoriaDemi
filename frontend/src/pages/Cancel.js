import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservationById, patchReservation } from "../api";
import { successfulCancelAlert } from "../swal2";
import FancyLine from "../images/FancyLine.png";

function Cancel() {
  const param = useParams();
  const navigate = useNavigate();
  const id = param["*"];
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const responseData = await getReservationById(id);
        setReservation(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    loadReservation();
  }, [id]);

  async function cancelRes() {
    try {
      const response = await patchReservation(id, "cancel");
      if (response.status === 200) {
        const promise = await successfulCancelAlert();
        if (promise) navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
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

  if (!reservation) return <div className="empty" />;
  return (
    <div className="reserve-container">
      <div className="reserve-section reserve-section-cancel">
        <div className="res-section-cancel">
          {reservation.state !== "cancel" ? (
            <>
              <div className="menu-section-header">
                Cancel your reservation?
              </div>
              <img
                className="fancy-line fancy-line-cancel"
                src={FancyLine}
                alt=""
              />
              <div className="res-to-cancel">
                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> Name </div>
                  <div className="res-to-cancel-info">{reservation.name} </div>
                </div>

                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> Party </div>
                  <div className="res-to-cancel-info">
                    {reservation.numGuests}{" "}
                    {reservation.numGuests === 1 ? "Guest" : "Guests"}
                  </div>
                </div>
                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> Date </div>
                  <div className="res-to-cancel-info">
                    {dateToString(reservation.date)}
                  </div>
                </div>
                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> Time </div>
                  <div className="res-to-cancel-info">
                    {convertTo12Hour(reservation.time)}
                  </div>
                </div>
              </div>
              <button
                className="submit-button res-cancel-btn"
                onClick={() => cancelRes()}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="menu-section-header">
              Your reservation has already been cancelled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cancel;

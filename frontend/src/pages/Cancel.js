import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservationById, patchReservation } from "../api";
import { successfulCancelAlert } from "../swal2";
import FancyLine from "../images/FancyLine.png";
import { convertTo12Hour, dateToString } from "../functions";

function Cancel() {
  const param = useParams();
  const navigate = useNavigate();
  const id = param["*"];
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadReservation = async () => {
      try {
        const responseData = await getReservationById(id, signal);
        setReservation(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    
    loadReservation();

    return () => {
      abortController.abort();
    };
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

  if (!reservation) return <div className="empty" />;
  return (
    <div className="reserve-container cancel-container">
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
                  <div className="res-to-cancel-atr"> name </div>
                  <div className="res-to-cancel-info">{reservation.name} </div>
                </div>

                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> party </div>
                  <div className="res-to-cancel-info">
                    {reservation.numGuests}{" "}
                    {reservation.numGuests === 1 ? "Guest" : "Guests"}
                  </div>
                </div>
                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> date </div>
                  <div className="res-to-cancel-info">
                    {dateToString(reservation.date)}
                  </div>
                </div>
                <div className="res-to-cancel-section">
                  <div className="res-to-cancel-atr"> time </div>
                  <div className="res-to-cancel-info">
                    {convertTo12Hour(reservation.time)}
                  </div>
                </div>
              </div>
              <br/>
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

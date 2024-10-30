import React, { useEffect, useState } from "react";
import ReservationHeader from "./ReservationHeader";
import ReservationDisplayer from "./ReservationDisplayer";
import NewRes from "./NewRes";
import { successfulAdminResAlert } from "../../../../swal2";
import ReservationSSE from "./ReservationSSE";
import moment from "moment-timezone";
import {
  getReservationsByDate,
  patchReservation,
  postAdminReservation,
} from "../../../../api";

function Reversations() {
  const [reservations, setReservations] = useState([]);
  const [newResOpen, setNewRes] = useState(false);

  function getCurrentShift() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours < 16 || (hours === 16 && minutes === 0)) {
      return "Lunch";
    } else {
      return "Dinner";
    }
  }

  const [shift, setShift] = useState(getCurrentShift());

  const toggleShift = () => {
    setShift((prevShift) => (prevShift === "Lunch" ? "Dinner" : "Lunch"));
  };

  const shiftReservations = reservations.filter((reservation) => {
    const [hoursStr, minutesStr] = reservation.time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (shift === "Lunch") {
      return hours < 16 || (hours === 16 && minutes === 0);
    } else {
      return hours > 16 || (hours === 16 && minutes > 0);
    }
  });

  const liveRes = shiftReservations.filter(
    (reservation) => reservation.state !== "cancel"
  );
  const cancelledRes = shiftReservations.filter(
    (reservation) => reservation.state === "cancel"
  );

  function getChicagoDateISO() {
    const chicagoTime = moment().tz("America/Chicago").toISOString();
    return chicagoTime;
  }

  const [date, setDate] = useState(getChicagoDateISO());

  const { data: reservation } = ReservationSSE();

  useEffect(() => {
    if (reservation) {
      const areDatesEqual =
        reservation.date.split("T")[0] === date.split("T")[0];
      if (areDatesEqual) {
        setReservations((prevReservations) => [
          ...prevReservations,
          reservation,
        ]);
      }
    }
  }, [reservation, date]);

  function sumGuests(reservations) {
    return reservations.reduce(
      (acc, reservation) => acc + reservation.numGuests,
      0
    );
  }

  function addResLocal(newRes) {
    const updatedReservations = [...reservations, newRes];
    updatedReservations.sort((a, b) => new Date(a.date) - new Date(b.date));
    setReservations(updatedReservations);
  }

  async function submitRes(res) {
    try {
      const response = await postAdminReservation(res);
      if (response.status === 201) {
        addResLocal(response.data);
        const promise = await successfulAdminResAlert();
        if (promise) setNewRes(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function patchRes(id, state) {
    try {
      await patchReservation(id, state);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadReservations(date, signal) {
    try {
      const response = await getReservationsByDate(date, signal);
      const sortedReservations = response.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setReservations(sortedReservations);
    } catch (error) {
      console.log(error);
    }
  }

  function newResButton() {
    return (
      <button
        onClick={() => setNewRes(!newResOpen)}
        type="button"
        className="res-amount-header new-res-btn"
      >
        {newResOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12H19"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    );
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    loadReservations(date, signal);

    return () => {
      abortController.abort();
    };
  }, [date]);

  return (
    <div className="reservations-container">
      {newResOpen && (
        <NewRes
          selfClose={() => setNewRes(false)}
          close={newResButton}
          submitRes={submitRes}
        />
      )}
      <div className="reservations-header">
        <div className="res-header">
          <ReservationHeader
            date={date}
            setDate={setDate}
            numGuests={sumGuests(liveRes)}
            numRes={liveRes.length}
            shift={shift}
            toggleShift={toggleShift}
            newResButton={newResButton}
          />
        </div>
      </div>
      <ReservationDisplayer
        reservations={reservations}
        liveRes={liveRes}
        cancelledRes={cancelledRes}
        setReservations={setReservations}
        patchRes={patchRes}
      />
    </div>
  );
}

export default Reversations;

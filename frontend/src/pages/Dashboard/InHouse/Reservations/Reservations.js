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

    if (hours < 17 || (hours === 17 && minutes === 0)) {
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
      return hours < 17 || (hours === 17 && minutes === 0);
    } else {
      return hours > 17 || (hours === 17 && minutes > 0);
    }
  });

  const liveRes = shiftReservations.filter(
    (reservation) => reservation.state !== "cancel"
  );
  const cancelledRes = shiftReservations.filter(
    (reservation) => reservation.state === "cancel"
  );

  const today = () => {
    const today = new Date();
    
    const options = {
      timeZone: 'America/Chicago',
      hour12: false,
    };
    const chicagoDateTime = today.toLocaleString('sv-SE', options);
  
    const chicagoISO = chicagoDateTime.replace(' ', 'T');
    console.log(chicagoISO)

    return chicagoISO;
  }

  const handleDateClick = () => {
    setDate(today())
  }

  const [date, setDate] = useState(today());

  useEffect(() => {
    console.log(date)
  }, [date])
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
          setNewRes={setNewRes}
          submitRes={submitRes}
        />
      )}
      <div className="reservations-header">
        <div className="res-header">
          <ReservationHeader
            date={date}
            setDate={setDate}
            handleDateClick={handleDateClick}
            numGuests={sumGuests(liveRes)}
            numRes={liveRes.length}
            shift={shift}
            toggleShift={toggleShift}
            setNewRes={setNewRes}
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

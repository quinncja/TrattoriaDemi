import React, { useEffect, useState } from "react";
import ReservationHeader from "./ReservationHeader";
import ReservationDisplayer from "./ReservationDisplayer";
import NewRes from "./NewRes";
import ReservationSSE from "./ReservationSSE";
import {
  getReservationsByDate,
  patchReservation,
  postAdminReservation,
  updateReservation,
} from "../../../../api";
import { Toaster, toast } from "sonner";
import ResModal from "./ResModal";

function Reversations() {
  const [reservations, setReservations] = useState([]);
  const [newResOpen, setNewRes] = useState(false);
  const [resModalOpen, setResModal] = useState(false);

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
    const [hoursStr] = reservation.time.split(":");
    const hours = parseInt(hoursStr, 10);

    if (shift === "Lunch") {
      return hours < 17;
    } else {
      return hours >= 16;
    }
  });

  const liveRes = shiftReservations.filter(
    (reservation) =>
      reservation.state !== "cancel" && reservation.state !== "noshow"
  );
  const cancelledRes = shiftReservations.filter(
    (reservation) =>
      reservation.state === "cancel" || reservation.state === "noshow"
  );

  const today = () => {
    const today = new Date();

    const options = {
      timeZone: "America/Chicago",
      hour12: false,
    };
    const chicagoDateTime = today.toLocaleString("en-US", options);
    const todayDateObj = new Date(chicagoDateTime);

    return todayDateObj;
  };

  const handleDateClick = () => {
    setDate(today());
  };

  const [date, setDate] = useState(today());

  const { data: reservation } = ReservationSSE();

  useEffect(() => {
    if (reservation) {
      const reservationDate = new Date(reservation.date);
      const areDatesEqual =
        reservationDate.toDateString() === date.toDateString();

      if (areDatesEqual) {
        setReservations((prevReservations) => {
          const reservationIndex = prevReservations.findIndex(
            (res) => res._id === reservation._id
          );

          if (reservationIndex > -1) {
            const updatedReservations = [...prevReservations];
            updatedReservations[reservationIndex] = reservation;
            return updatedReservations;
          } else {
            return [...prevReservations, reservation];
          }
        });
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
        toast.success("Reservation created");
        addResLocal(response.data);
        setNewRes(false);
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
      //setReservations(sortedReservations);
      setReservations(sortedReservations);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateRes(updatedRes) {
    try{
      const response = await updateReservation(updatedRes._id, updatedRes);
      if(response.status === 200){
        console.log(response)
        toast.success("Reservation updated");
        setResModal(false)

        const updResDate = new Date(updateRes.date)
        const areDatesEqual =
        updResDate.toDateString() === date.toDateString();

        setReservations((prev) => {
          if (areDatesEqual) {
            return prev.map((res) =>
              res._id === updatedRes._id ? updatedRes : res
            );
          } else {
            return prev.filter((res) => res._id !== updatedRes._id);
          }
        });

        setReservations((prev) => 
        prev.map((res) => (res._id === updatedRes._id ? updatedRes : res))
      );
      }

    } catch (error){
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

  document.body.classList.toggle("no-scroll", newResOpen);

  function closeNewRes(){
    setNewRes(false)
  }


  return (
    <div className="reservations-container">
      {newResOpen && (
        <NewRes
          selfClose={closeNewRes}
          setNewRes={setNewRes}
          submitRes={submitRes}
        />
      )}
      {resModalOpen && (
        <ResModal
          selfClose={() => setResModal(false)}
          updateRes={updateRes}
          res={resModalOpen}
        />
      )}
      <Toaster richColors position="bottom-center" />
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
        setResModal={setResModal}
      />
    </div>
  );
}

export default Reversations;

import React from "react";
import Reservation from "./Reservation";

function ReservationDisplayer(props) {
  const {
    reservations,
    liveRes,
    cancelledRes,
    setReservations,
    patchRes,
    setResModal,
  } = props;

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function handleBtnClick(res, state) {
    const updatedReservations = reservations.map((r) =>
      r._id === res._id
        ? { ...r, state: state, arrivedTime: getCurrentTime() }
        : r
    );
    setReservations(updatedReservations);
    patchRes(res._id, state);
  }

  function compareTime(aTime, bTime) {
    const [aHours, aMinutes] = aTime.split(":").map(Number);
    const [bHours, bMinutes] = bTime.split(":").map(Number);

    if (aHours !== bHours) {
      return aHours - bHours;
    } else {
      return aMinutes - bMinutes;
    }
  }

  const sortedLiveRes = [...liveRes].sort((a, b) =>
    compareTime(a.time, b.time)
  );
  const sortedCancelledRes = [...cancelledRes].sort((a, b) =>
    compareTime(a.time, b.time)
  );

  function mapReservations(resToMap) {
    return resToMap.map((res) => (
      <Reservation
        key={res._id}
        res={res}
        handleBtnClick={handleBtnClick}
        setResModal={setResModal}
      />
    ));
  }

  if (sortedLiveRes.length === 0 && sortedCancelledRes.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "50vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>No Reservations</h1>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      {sortedLiveRes && sortedLiveRes.length > 0 && (
        <div className="reservations-displayer">
          {mapReservations(sortedLiveRes)}
        </div>
      )}
      {sortedCancelledRes && sortedCancelledRes.length > 0 && (
          <div className="cancelled-res">
            <div className="cancelled-text">
              Cancelled
            </div>
            {mapReservations(sortedCancelledRes)}
          </div>
        )}
    </div>
  );
}

export default ReservationDisplayer;

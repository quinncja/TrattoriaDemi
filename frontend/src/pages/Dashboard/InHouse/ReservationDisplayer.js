import React from "react";
import Reservation from "./Reservation";

function ReservationDisplayer(props) {
  const reservations = props.reservations;
  const liveRes = props.liveRes;
  const cancelledRes = props.cancelledRes;
  const setReservations = props.setReservations;
  const patchRes = props.patchRes;

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

  function mapReservations(resToMap) {
    return resToMap.map((res) => (
      <Reservation key={res._id} res={res} handleBtnClick={handleBtnClick} />
    ));
  }

  return (
    <>
      {liveRes && liveRes.length > 0 && (
        <div className="reservations-displayer">{mapReservations(liveRes)}</div>
      )}
      {cancelledRes && cancelledRes.length > 0 && (
        <div className="cancelled-res">
          <div className="cancelled-text"> Cancelled </div>
          {mapReservations(cancelledRes)}
        </div>
      )}
    </>
  );
}

export default ReservationDisplayer;

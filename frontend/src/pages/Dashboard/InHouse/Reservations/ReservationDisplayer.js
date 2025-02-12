import React from "react";
import Reservation from "./Reservation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInMany, fadeInReservations } from "animations";
import { useMobile } from "context/MobileContext";

function ReservationDisplayer(props) {
  const { liveRes, cancelledRes, patchRes, setResModal, loading } = props;
  const { phone } = useMobile();
  const height = phone ? "4.7rem" : "5.5rem"

  function handleBtnClick(res, state) {
    patchRes(res, state);
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

  const containerVariants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  function mapReservations(resToMap) {
    return resToMap.map((res, index) => (
      <motion.div
        key={res._id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInReservations}
        custom={index}
        layout
        style={{ width: "100%", height: height }}
        className="res-mapper-wrapper"
      >
        <Reservation
          key={res._id}
          res={res}
          handleBtnClick={handleBtnClick}
          setResModal={setResModal}
        />
      </motion.div>
    ));
  }

  if (loading) return "";

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
      <AnimatePresence>
        {sortedLiveRes && sortedLiveRes.length > 0 && (
          <div className="reservations-displayer">
            {mapReservations(sortedLiveRes)}
          </div>
        )}
        {sortedCancelledRes && sortedCancelledRes.length > 0 && (
          <div className="cancelled-res">
            <div className="cancelled-text">Cancelled</div>
            {mapReservations(sortedCancelledRes)}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReservationDisplayer;

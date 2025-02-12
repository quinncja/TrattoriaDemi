import { useState } from "react";
import { formatPhoneNumber, convertTo12Hour } from "../../../../functions";
import { cancelBtnSvg, ghostSvg } from "svg";
import { dateTimeToString } from "dateUtils";
import { AnimatePresence, motion } from "framer-motion";
import { useMobile } from "context/MobileContext";

export function Reservation(props) {
  const [isOpen, setOpen] = useState(false);
  const { res, setResModal, handleBtnClick } = props;
  const { phone } = useMobile();

  const containerVariants = {
    open: {
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
      height: phone ? "6.1rem" : "7.1rem",
      marginBottom: "0px",
    },
    closed: {
      transition: {
        when: "afterChildren",
      },
      height: phone ? "4.7rem" : "5.5rem",
      marginBottom: "61px",
    },
  };

  function arrivedTime() {
    return (
      <motion.div
        layout="position"
        className="res-arrived-time"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBlock: "auto",
          height: "fit-content",
        }}
      >
        <motion.div className="res-name" layout>
          {" "}
          Arrived{" "}
        </motion.div>
        <motion.span className="arrived-time" layout>
          {" "}
          {convertTo12Hour(res.arrivedTime)}{" "}
        </motion.span>
      </motion.div>
    );
  }

  function completeButton() {
    return (
      <motion.button
        layout="position"
        className="res-btn"
        onClick={(event) => {
          event.stopPropagation();
          handleBtnClick(res, "arrived");
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="-.5 -2 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    );
  }

  function undoButton() {
    return (
      <button
        className="res-btn res-cancel"
        onClick={() => {
          setOpen(false);
          handleBtnClick(res, "upcoming");
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="-.5 -2 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4V10H7"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6193 20.3413 15.909 20.7742 14.0064C21.2072 12.1037 21.0101 10.112 20.2126 8.3311C19.4152 6.55025 18.0605 5.0768 16.3528 4.13277C14.6451 3.18874 12.6769 2.82527 10.7447 3.09712C8.81245 3.36897 7.02091 4.26142 5.64 5.64L1 10"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  function noShowButton() {
    return (
      <button
        className="res-btn res-noshow"
        onClick={() => {
          setOpen(false);
          handleBtnClick(res, "noshow");
        }}
      >
        {ghostSvg()}
      </button>
    );
  }

  function cancelButton() {
    return (
      <button
        className="res-btn res-cancel"
        onClick={() => {
          setOpen(false);
          handleBtnClick(res, "cancel");
        }}
      >
        {cancelBtnSvg()}
      </button>
    );
  }
  function noteSymbol() {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H17L21 21V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V15Z"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const stateMap = {
    noshow: ghostSvg(),
    cancel: cancelBtnSvg(),
  };

  return (
    <>
      <motion.button
        className={`res 
        ${res.selfMade && "res-selfmade"}
        ${res.state === "arrived" && "res-arrived"} res-${isOpen}`}
        key={res._id}
        onClick={() => setOpen(!isOpen)}
        variants={containerVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        layout="position"
      >
        <motion.div className="res-row" layout="position">
          <motion.div className="res-left">
            <motion.div
              className={`res-amount`}
              layout="position"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignContent: "center",
                marginBlock: "auto",
                height: "fit-content",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setResModal(res);
              }}
            >
              {res.numGuests}
            </motion.div>
            <div className="res-left-text">
              <motion.div className="res-time" layout="position">
                {convertTo12Hour(res.time)}
              </motion.div>
              <motion.div className="res-name" layout="position">
                {res.name}
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="res-time"
                    className="res-time"
                    transition={{ ease: "linear", duration: 0.2 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {" "}
                    {dateTimeToString(new Date(res.dateMade))}{" "}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <div className="res-right-side">
            <motion.div className="res-btns">
              {res.state !== "cancel" &&
                res.state !== "noshow" &&
                res.notes &&
                noteSymbol()}
              {res.state === "upcoming" && completeButton()}
              {res.state === "arrived" && arrivedTime()}
              {(res.state === "cancel" || res.state === "noshow") && (
                <motion.button className="res-btn res-btn-mock">
                  {" "}
                  {stateMap[res.state]}{" "}
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.button>
      <div
        className={`bottom-wrapper bottom-wrapper-${isOpen} ${
          res.selfMade && "res-selfmade"
        }`}
      >
        <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="res-time"
                    className="res-bottom" 
                    layout="position"
                    transition={{ ease: "linear", duration: 0.2 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <motion.div                     
                    transition={{ ease: "linear", duration: 0.2 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px"
                      
                    }}>
                    {" "}
                    <strong> {res.phone && formatPhoneNumber(res.phone)} </strong>
                      <div> {res.notes || "No notes"} </div>
                    </motion.div>
                    <motion.div
                                     transition={{ ease: "linear", duration: 0.2 }}
                                     initial={{ opacity: 0, y: -10 }}
                                     animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        alignItems: "center",
                        
                      }}
                    >
                      {res.state !== "upcoming" && undoButton()}
                      {res.state === "upcoming" && cancelButton()}
                      {res.state === "upcoming" && noShowButton()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
      </div>
    </>
  );
}

export default Reservation;

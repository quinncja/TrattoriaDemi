import { useState, useRef, useEffect } from "react";
import { leftArrow, rightArrow } from "svg";
import { AnimatePresence, motion } from "framer-motion";
import { dateToString } from "dateUtils";

function ReservationHeader(props) {
  const {
    date,
    setDate,
    shift,
    toggleShift,
    numGuests,
    numRes,
    setNewRes,
    handleDateClick,
    loading,
  } = props;
  const timerRef = useRef();
  const isLongPress = useRef();
  const [calOpen, setCalOpen] = useState(false);
  const calInputRef = useRef(null);

  function shiftChanger() {
    return (
      <div className="shift-wrapper">
        <div onClick={toggleShift} className="toggle-container">
          <motion.div
            className="toggle"
            animate={{
              x: shift === "Lunch" ? 0 : 80,
            }}
            transition={{
              type: "spring",
              stiffness: 800,
              damping: 50,
            }}
          />

          <div className="toggle-labels-container">
            <span className="toggle-label">Lunch</span>
            <span className="toggle-label">Dinner</span>
          </div>
        </div>
      </div>
    );
  }

  function openNewRes(){
    setNewRes(true)
  }

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setCalOpen(true);
    }, 300);
  }

  function handleOnMouseDown() {
    startPressTimer();
  }

  function handleOnTouchStart() {
    startPressTimer();
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current);
  }

  function differentiateClick() {
    if (isLongPress.current) {
      return;
    }
    handleDateClick();
  }

  useEffect(() => {
    if (calOpen && calInputRef.current) {
      // const input = document.getElementById("date-p")
      // input.showPicker();
    }
  }, [calOpen]);

  function dateChanger() {
    const buttonClick = (id) => {
      const dateAsObj = new Date(date);

      if (id === "back") {
        dateAsObj.setDate(dateAsObj.getDate() - 1);
      }
      if (id === "forward") {
        dateAsObj.setDate(dateAsObj.getDate() + 1);
      }

      setDate(dateAsObj);
    };

    return (
      <div className="date-changer-container">
        <button
          className="date-changer-btn dcbb"
          id="back"
          onClick={(event) => buttonClick(event.target.id)}
        >
          {leftArrow()}
        </button>
        <div
          id="date-changer-text"
          className="date-changer-text"
          onMouseDown={handleOnMouseDown}
          onMouseUp={handleOnMouseUp}
          onTouchStart={handleOnTouchStart}
          onTouchEnd={handleOnTouchEnd}
          onClick={differentiateClick}
        >
          {" "}
          {dateToString(date)}{" "}
        </div>
        <button
          className="date-changer-btn dcbf"
          id="forward"
          onClick={(event) => buttonClick(event.target.id)}
        >
          {rightArrow()}
        </button>
        {calOpen && (
          <div className="date-hider">
            <button id="fake-button" htmlFor="date-p" />
            <input
              id="date-p"
              type="date"
              ref={calInputRef}
              defaultValue={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCalOpen(false);
              }}
              onBlur={() => setCalOpen(false)}
            />
          </div>
        )}
      </div>
    );
  }
  

  function numResDisplay() {
    return (
      <div className="res-amount res-amount-header">
        <AnimatePresence>
        {!loading && (
          <motion.span
            style={{minWidth: "2ch"}}
            key="numRes" 
            initial={{ opacity: 0, y: -3 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 3 }} 
            transition={{ duration: 0.3 }} 
          >
            {numRes}
          </motion.span>
        )}
      </AnimatePresence>
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
    );
  }

  function numGuestDisplay() {
    return (
      <div className="res-amount res-amount-header">
      <AnimatePresence>
        {!loading && (
          <motion.span
            style={{minWidth: "2ch"}}
            key="numGuests"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.3 }}
          >
            {numGuests}
          </motion.span>
        )}
      </AnimatePresence>
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
    );
  }

  const newResButton = () => {
    return (
      <button
        onClick={() => openNewRes(true)}
        type="button"
        className="new-res-btn2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 -1 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="meet"
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
      </button>
    );
  };

  return (
    <>
      <div className="res-amounts">
        {numResDisplay()}
        {numGuestDisplay()}
      </div>
      <>
        {dateChanger()}
        {shiftChanger()}
      </>
      <div style={{ marginLeft: "auto" }}>{newResButton()}</div>
    </>
  );
}

export default ReservationHeader;

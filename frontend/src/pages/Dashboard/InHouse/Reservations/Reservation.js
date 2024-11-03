import { useState } from "react";
import { formatPhoneNumber, convertTo12Hour } from "../../../../functions";
import { cancelBtnSvg, ghostSvg } from "svg";

export function Reservation(props) {
  const [isOpen, setOpen] = useState(false);
  const { res, setResModal, handleBtnClick } = props;

  function arrivedTime() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "3.5rem",
        }}
      >
        <div className="res-name"> Arrived </div>
        <span className="arrived-time">
          {" "}
          {convertTo12Hour(res.arrivedTime)}{" "}
        </span>
      </div>
    );
  }

  function completeButton() {
    return (
      <button
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
      </button>
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
      <button
        className={`res 
        ${res.selfMade && "res-selfmade"}
        ${res.state === "arrived" && "res-arrived"} res-${isOpen}`}
        key={res._id}
        onClick={() => setOpen(!isOpen)}
      >
        <div className="res-row">
          <div className="res-left">
            <div
              className={`res-amount`}
              onClick={(e) => {
                e.stopPropagation();
                setResModal(res);
              }}
            >
              {res.numGuests}
            </div>
            <div>
              <div className="res-time">{convertTo12Hour(res.time)}</div>
              <div className="res-name">{res.name}</div>
            </div>
          </div>
          <div className="res-right-side">
            <div className="res-btns">
              {res.state !== "cancel" &&
                res.state !== "noshow" &&
                res.notes &&
                noteSymbol()}
              {res.state === "upcoming" && completeButton()}
              {res.state === "arrived" && arrivedTime()}
              {(res.state === "cancel" || res.state === "noshow") && (
                <button className="res-btn res-btn-mock">
                  {" "}
                  {stateMap[res.state]}{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      </button>
      <div
        className={`bottom-wrapper bottom-wrapper-${isOpen} ${
          res.selfMade && "res-selfmade"
        }`}
      >
        <div className="res-bottom">
          <div className="res-open-notes">
            <strong> {res.phone && formatPhoneNumber(res.phone)} </strong>
            <div> {res.notes || "No notes"} </div>
          </div>
          <div
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Reservation;

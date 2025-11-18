import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getReservationById, patchReservation, updateReservation } from "api";
import {
  cancelReservationAlert,
  successfulCancelAlert,
  successfulReserveAlert,
  successfulUpdatedAlert,
} from "swal2";
import FancyLine from "images/FancyLine.png";
import { convertTo12Hour, getFirstWord } from "functions";
import { resBookSvg } from "svg";
import ModifyRes from "./ModifyRes";
import { fadeIn } from "animations";
import { motion } from "framer-motion";
import { dateToString } from "dateUtils";

function Reservation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.has("success");
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [isModify, setModify] = useState(false);
  const resText = isModify
    ? "Subject to table availability"
    : "We look forward to serving you";

  useEffect(() => {
    if (isSuccess) {
      successfulReserveAlert();
    }
  }, [isSuccess]);

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

    if (!reservation) loadReservation();

    return () => {
      abortController.abort();
    };
  }, [id, reservation]);

  const updateRes = async (newTable) => {
    const updatedRes = {
      ...reservation,
      ...newTable,
    };

    try {
      const response = await updateReservation(id, updatedRes);
      if (response.status === 200) {
        successfulUpdatedAlert();
        setReservation(null);
        setModify(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function cancelRes() {
    try {
      const obj = await cancelReservationAlert();
      if (obj.isConfirmed) {
        const response = await patchReservation(id, "cancel", "Customer");
        if (response.status === 200) {
          const promise = await successfulCancelAlert();
          if (promise) navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const resBody = () => {
    return (
      <>
        <div className="res-card">
          <div className="res-top-line">
            <div className="res-info res-info-name">{reservation.name} </div>

            <div className="res-info res-info-guests">
              {reservation.numGuests}{" "}
              {reservation.numGuests === 1 ? "Guest" : "Guests"}
            </div>
          </div>

          <div className="res-info res-info-time">
            {`${dateToString(new Date(reservation.date))} at ${convertTo12Hour(
              reservation.time
            )}`}
          </div>
          <div className="res-info res-info-note">
            Table held for 10 minutes
          </div>
        </div>

        <div className="res-buttons">
          <button
            className="submit-button modify-btn"
            onClick={() => setModify(true)}
          >
            Modify
          </button>
          <button
            className="submit-button res-cancel-btn"
            onClick={() => cancelRes()}
          >
            Cancel Reservation
          </button>
        </div>
      </>
    );
  };

  if (!reservation) return <div className="empty" />;
  if (reservation.state === "cancel")
    return (
      <div className="review-container res-container">
        <div className="review-box">
          <div className="menu-section-header">
            This reservation has been cancelled
          </div>
          <img className="fancy-line review-line" src={FancyLine} alt="" />
          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              color: "#444444",
            }}
          >
            To make a new reservation, please click below
          </div>

          <button className="clean-button" onClick={() => navigate("/reserve")}>
            {resBookSvg()} Reserve
          </button>
        </div>
      </div>
    );
  if (reservation.state === "arrived")
    return (
      <div className="review-container res-container">
        <div className="review-box">
          <div className="menu-section-header">
            We hope to see you again soon
          </div>
          <img className="fancy-line review-line" src={FancyLine} alt="" />
          <div
            style={{
              paddingTop: "0px",
              paddingBottom: "40px",
              color: "#444444",
              textAlign: "left",
            }}
          >
            It was a pleasure to serve you, {getFirstWord(reservation.name)}
          </div>

          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              color: "#444444",
            }}
          >
            To make a new reservation, please click below
          </div>
          <button className="clean-button" onClick={() => navigate("/reserve")}>
            {resBookSvg()} Reserve
          </button>
        </div>
      </div>
    );
  return (
    <motion.div {...fadeIn} className="review-container res-container">
      <div className="review-box res-box">
        <div>
          <div className="menu-section-header res-header-text">
            {" "}
            {isModify && "Modify"} Your Reservation
          </div>
          <img className="fancy-line review-line" src={FancyLine} alt="" />
          <div
            style={{
              marginTop: "-10px",
              paddingBottom: "10px",
              color: "#444444",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {resText}
          </div>
        </div>
        {isModify ? (
          <ModifyRes
            reservation={reservation}
            setModify={setModify}
            updateRes={updateRes}
          />
        ) : (
          resBody()
        )}
      </div>
    </motion.div>
  );
}

export default Reservation;

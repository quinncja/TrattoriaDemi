import React, { useEffect, useState } from "react";
import { getSystemStatus, patchSystemStatus } from "../../../api";

function OrderHeader(props) {
  const { state, setState } = props;
  const [status, setStatus] = useState();
  const { delivery, pickup } = status || {};
  const statusLight = delivery || pickup;
  const [statusOpen, setOpen] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await getSystemStatus();
        setStatus(response);
      } catch (error) {
        console.log(error);
      }
    }
    loadStatus();
  }, []);

  async function handleClick(id) {
    const previousStatus = { ...status };
    const updatedStatus = {
      ...status,
      [id]: !status[id],
    };
    setStatus(updatedStatus);
    console.log(updatedStatus);
    try {
      const response = await patchSystemStatus(updatedStatus);
      console.log(response);
    } catch (error) {
      console.error("Failed to update system status. Reverting...", error);
      setStatus(previousStatus);
    }
  }

  const statusButton = () => {
    if (statusOpen) {
      return (
        <button
          type="button"
          className="status-btn"
          onClick={() => setOpen(false)}
        >
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
        </button>
      );
    }
    return (
      <button
        type="button"
        className="status-btn"
        onClick={() => setOpen(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const deliveryStatus = () => {
    if (statusOpen) {
      return (
        <button
          type="button"
          className="status-button order-header-container"
          onClick={() => handleClick("delivery")}
        >
          <div
            className={`status-symbol ${delivery ? "ss-green" : "ss-red"}`}
          />
          Delivery
        </button>
      );
    }
    if (delivery) {
      return (
        <div className="order-header-container left-margin">
          <svg
            width="24"
            height="24"
            viewBox="0 -2 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 3H1V16H16V3Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8H20L23 11V16H16V8Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 21C6.88071 21 8 19.8807 8 18.5C8 17.1193 6.88071 16 5.5 16C4.11929 16 3 17.1193 3 18.5C3 19.8807 4.11929 21 5.5 21Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
  };

  const pickupStatus = () => {
    if (statusOpen) {
      return (
        <button
          type="button"
          className="status-button order-header-container"
          onClick={() => handleClick("pickup")}
        >
          <div className={`status-symbol ${pickup ? "ss-green" : "ss-red"}`} />
          Pickup
        </button>
      );
    }
    if (pickup) {
      return (
        <div className="order-header-container">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
  };

  const statusButtons = () => {
    return (
      <div className="order-header-container">
        {pickupStatus()}
        {deliveryStatus()}
        {!statusOpen && <div />}
        {statusButton()}
      </div>
    );
  };

  return (
    <div className="orders-hide-overflow onehundred">
      <div className="order-header-container ohc-apart">
        <div className="order-header-container">
          <button className="order-header" onClick={() => setState(!state)}>
            {" "}
            Orders{" "}
          </button>
          <div
            className={`status-symbol ${statusLight ? "ss-green" : "ss-red"}`}
          />
        </div>
        {statusButtons()}
      </div>
    </div>
  );
}

export default OrderHeader;

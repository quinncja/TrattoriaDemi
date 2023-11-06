import React, { useEffect, useState } from "react";
import { getSystemStatus, patchSystemStatus } from "../../../api";
import { deliverySvg, pickupSvg } from "../../../svg";

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
          {deliverySvg()}
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
      return <div className="order-header-container">{pickupSvg()}</div>;
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

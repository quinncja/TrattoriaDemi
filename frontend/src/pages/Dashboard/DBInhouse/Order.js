import { useState, useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import moment from "moment-timezone";

function Order(props) {
  const order = props.order;
  const setState = props.setState;
  const cancelOrder = props.cancelOrder;
  const completeOrder = props.completeOrder;
  const [button, setButton] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [custom, setCustom] = useState();
  const [scope, animate] = useAnimate();
  const confirmOrder = props.confirmOrder;
  const [time, setTime] = useState(moment.tz("America/Chicago"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz("America/Chicago"));
    }, 1000 * 60); // Update every minute

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const shakeEffect = {
        rotate: [0, 15, -15, 15, 0],
        scale: [1, 1.07, 1.07, 1],
        transition: {
          duration: 3,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          loop: 1,
        },
      };
      animate(scope.current, shakeEffect);
    }, 5000);

    return () => clearInterval(interval);
  }, [animate, scope]);

  useEffect(() => {
    setButton(false);
  }, [isOpen]);

  function onButtonClick(int) {
    if (button === int) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + int + 1);
      confirmOrder(order._id, date);
    } else setButton(int);
  }

  function onCustomClick(int) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + int + 1);
    confirmOrder(order._id, date);
  }

  function getSymbol() {
    if (order.status === "waiting") {
      return (
        <div ref={scope} className="waiting-symbol">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.3301 4.09406C17.3322 4.06299 17.3333 4.03163 17.3333 4.00001C17.3333 3.26363 16.7364 2.66667 16 2.66667C15.2636 2.66667 14.6667 3.26363 14.6667 4.00001C14.6667 4.03163 14.6678 4.06299 14.6699 4.09406C10.1453 4.73963 6.66667 8.63024 6.66667 13.3333V22.6667H5.33333C4.59695 22.6667 4 23.2636 4 24C4 24.7364 4.59695 25.3333 5.33333 25.3333H12C12 27.5425 13.7909 29.3333 16 29.3333C18.2091 29.3333 20 27.5425 20 25.3333H26.6667C27.403 25.3333 28 24.7364 28 24C28 23.2636 27.403 22.6667 26.6667 22.6667H25.3333V13.3333C25.3333 8.63024 21.8547 4.73963 17.3301 4.09406ZM22.6667 13.3333V22.6667H9.33333V13.3333C9.33333 9.65144 12.3181 6.66667 16 6.66667C19.6819 6.66667 22.6667 9.65144 22.6667 13.3333ZM16 26.6667C15.2636 26.6667 14.6667 26.0697 14.6667 25.3333H17.3333C17.3333 26.0697 16.7364 26.6667 16 26.6667Z"
              fill="white"
            />
          </svg>
        </div>
      );
    }
    if (order.type === "delivery") {
      return (
        <div className="res-amount">
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
    } else
      return (
        <div className="res-amount">
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

  function getTimeFromDate(dateStr) {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function convertTo12Hour(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    let period = "am";
    if (hours >= 12) {
      period = "pm";
    }

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  }

  function formatPhoneNumber(phoneNumber) {
    const last10Digits = phoneNumber.slice(-10);
    const match = last10Digits.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]})-${match[2]}-${match[3]}`;
    }

    return null;
  }

  function displayModifiers(modifiers) {
    const optionArr = [];
    if (modifiers.size) {
      optionArr.push(modifiers.size);
    }
    if (modifiers.sauce) {
      optionArr.push(modifiers.sauce);
    }
    if (modifiers.pasta) {
      optionArr.push("Sub " + modifiers.pasta);
    }
    if (modifiers.options) {
      for (let i = 0; i < modifiers.options.length; i++)
        optionArr.push(modifiers.options[i]);
    }
    if (modifiers.dressing) {
      optionArr.push(`extra dressing (${modifiers.dressingQty})`);
    }
    return optionArr.join(", ");
  }

  function timeInput(input) {
    const inputs = order.type === "delivery" ? [45, 60, 75] : [10, 15, 20];

    return (
      <div className={`input-${input} order-time`}>
        <div className={`input-text white order-time-text`}> Confirm Time </div>
        <div className="tip-buttons">
          <button
            id={inputs[0]}
            className={`reserve-button-invert ${
              button && button !== inputs[0] && "rbi-inactive"
            }`}
            onClick={() => onButtonClick(inputs[0])}
          >
            {inputs[0]} mins
          </button>
          <button
            id={inputs[1]}
            className={`reserve-button-invert ${
              button && button !== inputs[1] && "rbi-inactive"
            }`}
            onClick={() => onButtonClick(inputs[1])}
          >
            {inputs[1]} mins
          </button>
          <button
            id={inputs[2]}
            className={`reserve-button-invert ${
              button && button !== inputs[2] && "rbi-inactive"
            }`}
            onClick={() => onButtonClick(inputs[2])}
          >
            {inputs[2]} mins
          </button>
          <div className="other-input">
            <input
              type="text"
              id="other"
              onFocus={() => setButton("custom")}
              className={`reserve-select-invert select-other ${
                button && button !== "custom" && "rbi-inactive"
              }`}
              onChange={(event) => setCustom(event.target.value)}
              placeholder="Other"
            ></input>
            <button
              className={`reserve-button-invert other-right ${
                button && button !== "custom" && "rbi-inactive"
              }`}
              onClick={() => onCustomClick(Number(custom))}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  }

  function completeButton() {
    return (
      <button
        className="res-btn"
        onClick={(event) => {
          event.stopPropagation();
          completeOrder(order);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
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

  function cancelButton() {
    return (
      <button
        className="res-btn res-cancel"
        onClick={(event) => {
          event.stopPropagation();
          cancelOrder(order._id);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.93018 4.93L19.0702 19.07"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  function orderItem(item) {
    return (
      <div className="checkout-item">
        <div className="checkout-item-left">
          <div className="checkout-item-header no-padding">
            <div className="itemz-row">
              <div className="checkout-item-name item-name order-item-name">
                {item.name}
              </div>
              <div className="checkout-item-qty">x{item.qty}</div>
            </div>
            <div className="item-price">{item.totalPrice}</div>
          </div>
          <div className="item-options">{displayModifiers(item.modifiers)}</div>
          {item.instructions && (
            <div className="item-options">{item.instructions}</div>
          )}
        </div>
      </div>
    );
  }

  function orderSummary() {
    return (
      <>
        <div className="order-summary">
          <div className="order-notes-left"> order </div>
          <div className="order-itemz">
            {order.items.map((item) => orderItem(item))}
          </div>
        </div>
        <div className="order-summary-bottom">
          {order.type === "delivery" && order.tip && (
            <div className="checkout-price">
              <div className="order-notes-left">tip</div>
              <div>${order.tip.toFixed(2)}</div>
            </div>
          )}
          <div className="checkout-price cpb">
            <div className="order-notes-left"> {`total`} </div>

            <div>
              {" "}
              {!order.isPaid && <div className="not-paid"> Not Paid - </div>} $
              {order.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </>
    );
  }

  function orderInfo() {
    return (
      <div className="res-open-notes order-info">
        <div className="row">
          <div className="order-notes-left"> phone </div>
          <div> {order.phone && formatPhoneNumber(order.phone)} </div>
        </div>
        {order.type === "delivery" && (
          <div className="row">
            <div className="order-notes-left"> address </div>
            <div> {order.address} </div>
          </div>
        )}
        {order.notes && (
          <div className="row">
            <div className="order-notes-left"> notes </div>
            <div> {order.notes} </div>
          </div>
        )}
      </div>
    );
  }

  function orderOpen() {
    return (
      <div className={`bottom-wrapper bottom-wrapper-${isOpen}`}>
        <div className="res-bottom order-bottom">
          {orderInfo()}
          <div className="feint-line" />
          {orderSummary()}
          {order.status === "waiting" && (
            <>
              <div className="feint-line" />
              {timeInput()}
            </>
          )}
        </div>
      </div>
    );
  }

  function getTimeText() {
    if (order.status === "completed") {
      return "Complete";
    }
    if (order.status === "waiting") {
      return `New ${order.type}`;
    }
    const target = moment.tz(
      order.estimatedReady,
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "America/Chicago"
    );
    const diff = target.diff(time, "minutes");
    if (0 > diff) return "Due";
    return ` ${diff} minutes`;
  }

  function getUtensils() {
    return (
      <div className="order-icon">
        <svg x="0px" y="0px" viewBox="-4 -4 100 125">
          <path
            fill="#ffffff"
            d="M63.542,0c-4.167,0-4.167,0-4.167,4.167v91.667c0,4.167,0,4.167,4.167,4.167h4.167c4.167,0,4.167,0,4.167-4.167v-37.5h8.333  V29.167C80.208,10.417,71.875,0,63.542,0z M46.875,0c-2.083,0-2.083,0-2.083,4.167v25c0,2.083-4.167,2.083-4.167,0v-25  C40.625,0,40.625,0,38.542,0c-2.083,0-2.083,0-2.083,4.167v25c0,2.083-4.167,2.083-4.167,0v-25C32.292,0,32.292,0,30.208,0  s-2.083,0-2.083,4.167v25c0,2.083-4.167,2.083-4.167,0v-25C23.958,0,23.958,0,21.875,0s-2.083,0-2.083,4.167V25  c0,20.833,8.333,16.667,8.333,33.333v37.5c0,4.167,0,4.167,4.167,4.167h4.167c4.167,0,4.167,0,4.167-4.167v-37.5  c0-16.667,8.333-12.5,8.333-33.333V4.167C48.958,0,48.958,0,46.875,0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <button
        className={`res ${
          order.status === "completed"
            ? "res-arrived"
            : order.status === "waiting"
            ? "new-order"
            : ""
        } res-${isOpen} res-order`}
        key={order._id}
        onClick={() => {
          setState(true);
          setOpen((prevOpen) => !prevOpen);
        }}
      >
        <div className="res-row">
          <div className="res-left">
            {getSymbol()}
            <div>
              <div className="res-name">{order.customerName}</div>
              <div className="res-time">{getTimeText()}</div>
            </div>
          </div>
          <div className="order-icons">{order.utensils && getUtensils()}</div>
          <div className="res-right-side">
            <div>{convertTo12Hour(getTimeFromDate(order.timePlaced))} </div>
            {order.status === "waiting"
              ? cancelButton()
              : order.status === "confirmed"
              ? completeButton()
              : ""}
          </div>
        </div>
      </button>
      {orderOpen()}
    </>
  );
}
export default Order;

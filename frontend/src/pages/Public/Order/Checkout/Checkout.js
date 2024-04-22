import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "animations";
import Input from "components/Input";

function Checkout(props) {
  const { type, submitCheckout, items, price, mobile, tip, setTip } = props;
  const [activeBtn, setActiveButton] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [notes, setNotes] = useState(null);
  const [checkbox, setCheckbox] = useState(null);
  const [tipString, setTipString] = useState("");

  const handleChange = (event) => {
    if (event.target.id === "name") {
      setError((errorStates) => ({ ...errorStates, name: false }));
      setName(event.target.value);
    }
    if (event.target.id === "address") {
      setError((errorStates) => ({ ...errorStates, address: false }));
      setAddress(event.target.value);
    }
    if (event.target.id === "guests") {
      setError((errorStates) => ({ ...errorStates, phone: false }));
      setPhone(event.target.selectedIndex);
    }
    if (event.target.id === "notes") {
      setNotes(event.target.value);
    }
    if (event.target.id === "other") {
      setTip(event.target.value);
      setError((errorStates) => ({ ...errorStates, time: false }));
    }
  };
  const handlePlaceSelect = (place) => {
    setError((errorStates) => ({ ...errorStates, address: false }));
    setAddress(place);
  };
  const handlePhoneChange = (value) => {
    setPhone(value);
    setError((errorStates) => ({ ...errorStates, phone: false }));
  };
  const [errorStates, setError] = useState({
    name: false,
    address: false,
    phone: false,
    type: false,
  });
  const inputText = {
    name: errorStates.name ? "Enter your name" : "Name",
    address: errorStates.address ? "Enter your address" : "Delivery Address",
    phone: errorStates.phone ? "Enter your phone number" : "Phone number",
    type: errorStates.type ? "Select an order type" : "Order type",
    notes: "Instructions",
    tip: "Gratuity for your driver",
  };
  const inputObjs = {
    name: {
      name: "Name",
      id: "name",
      text: inputText.name,
      error: errorStates.name,
      handleChange,
    },
    phone: {
      name: "phone",
      type: "phone",
      text: inputText.phone,
      error: errorStates.phone,
      value: phone,
      handleChange: handlePhoneChange,
    },
    address: {
      name: "address",
      type: "address",
      text: inputText.address,
      error: errorStates.address,
      hidden: type === "pickup" ? true : false,
      handleChange,
      handlePlaceSelect,
    },
    notes: {
      name: "notes",
      type: "textarea",
      text: inputText.notes,
      handleChange,
    },
  };

  function utensils() {
    return (
      <div className="another-row">
        <div className="phone-checkbox">
          <button
            className={` checkbox ${checkbox && "checkbox-active"}`}
            type="button"
            onClick={() => setCheckbox(!checkbox)}
          />
          <div className={`reserve-small-text ${mobile && "smallllll-text"}`}>
            {" "}
            Include utensils{" "}
          </div>
        </div>
      </div>
    );
  }

  const handleTipChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setTipString(value);
      setTip(parseFloat(value));
    }
    if (value === "") {
      setTip(Number(0));
    }
  };

  function tipInput(input) {
    return (
      <div className={`input-${input} input-group`}>
        <div
          className={`input-text ${errorStates[input] && `input-text-error`}`}
        >
          {" "}
          {inputText[input]}{" "}
        </div>
        <div className="tip-buttons">
          <button
            id="15"
            className={`reserve-button rb-c ${
              activeBtn === 15 && "reserve-button-active"
            }`}
            onClick={() => {
              setActiveButton(15);
              setTip(price * 15 * 0.01);
            }}
          >
            15%
          </button>
          <button
            id="20"
            className={`reserve-button rb-c ${
              activeBtn === 20 && "reserve-button-active"
            }`}
            onClick={() => {
              setActiveButton(20);
              setTip(price * 20 * 0.01);
            }}
          >
            20%
          </button>
          <button
            id="25"
            className={`reserve-button rb-c ${
              activeBtn === 25 && "reserve-button-active"
            }`}
            onClick={() => {
              setActiveButton(25);
              setTip(price * 25 * 0.01);
            }}
          >
            25%
          </button>
          <input
            type="text"
            id="other"
            className={`reserve-select select-other`}
            onChange={handleTipChange}
            onClick={() => setActiveButton(null)}
            placeholder="Other"
            value={tipString}
          ></input>
        </div>
      </div>
    );
  }

  const checkoutValidator = () => {
    console.log(address);
    let isError = false;
    if (!name) {
      setError((errorStates) => ({ ...errorStates, name: true }));
      isError = true;
    }
    if (!phone) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, phone: true }));
    }
    if (type === "delivery") {
      if (!address) {
        isError = true;
        setError((errorStates) => ({ ...errorStates, address: true }));
      }
    }
    return isError;
  };

  async function handleSubmit() {
    if (!checkoutValidator()) {
      const newOrder = {
        type,
        customerName: name,
        address,
        phone,
        notes,
        utensils: checkbox,
        tip,
        items,
      };
      //needs second arg if pay at pickup
      submitCheckout(newOrder);
    }
  }

  return (
    <>
      {type && (
        <AnimatePresence>
          <motion.div {...fadeIn}>
            <div className="checkout-inputs">
              {type === "delivery" && tipInput("tip")}
              <div className="row checkout-row">
                {Input(inputObjs.name)}
                {Input(inputObjs.phone)}
              </div>
              {Input(inputObjs.address)}
              {Input(inputObjs.notes)}
              {utensils()}
            </div>
            <div className="reserve-small-text ord">
              {" "}
              Wait times may vary.
              <div className="br" /> You will receive a text once your order has
              been confirmed.
            </div>
            <div className="mockline" />
            <button className="submit-button" onClick={() => handleSubmit()}>
              {" "}
              Checkout with stripe{" "}
            </button>
            {type === "pickup" && (
              <button
                className="submit-button submit-button-secondary"
                onClick={() => handleSubmit("pickup")}
              >
                {" "}
                Pay at register{" "}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

export default Checkout;

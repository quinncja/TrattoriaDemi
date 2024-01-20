import { useEffect, useState } from "react";
import { postGiftcard } from "api.js";
import FancyLine from "images/FancyLine.png";
import { successfulGiftcardAlert } from "swal2.js";
import Input from "components/Input.js";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "animations.js";

function Giftcard() {
  const [recipient, setRecipient] = useState(null);
  const [shipAddress, setShipAddress] = useState("");
  const [message, setMessage] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [email, setEmail] = useState(null);
  const [errorStates, setError] = useState({
    recipient: false,
    address: false,
    message: false,
    button: false,
    emailFormat: false,
  });

  const inputText = {
    recipient: errorStates.recipient
      ? "Please enter the receipient's name"
      : "Recipient's Name",
    address: errorStates.address
      ? "Please enter a shipping address"
      : "Shipping Address",
    button: errorStates.button ? "Please select an amount" : "Giftcard Amount",
    message: "Message to recipient",
  };

  const handleChange = (event) => {
    if (event.target.id === "recipient") {
      setError((errorStates) => ({ ...errorStates, recipient: false }));
      setRecipient(event.target.value);
    }
    if (event.target.id === "address") {
      setError((errorStates) => ({ ...errorStates, address: false }));
      setShipAddress(event.target.value);
    }
    if (event.target.id === "message") {
      setMessage(event.target.value);
    }
    if (event.target.id === "email") {
      setError((errorStates) => ({ ...errorStates, email: false }));
      setError((errorStates) => ({ ...errorStates, emailFormat: false }));
      setEmail(event.target.value);
    }
  };

  const inputObjs = {
    name: {
      name: "recipient",
      id: "recipient",
      text: inputText.recipient,
      error: errorStates.recipient,
      handleChange,
    },
    email: {
      name: "email",
      id: "email",
      text: inputText.email,
      error: errorStates.email,
      handleChange,
    },
    message: {
      name: "message",
      id: "message",
      type: "textarea",
      text: inputText.message,
      handleChange,
    },
    address: {
      name: "address",
      type: "address",
      text: inputText.address,
      error: errorStates.address,
      handleChange,
    },
  };

  const values = [
    { price: 15, id: "price_1NwtqREFXALc8iLMZINi83Oc" },
    { price: 25, id: "price_1NwtqiEFXALc8iLMEJmZE3eD" },
    { price: 50, id: "price_1NwtrKEFXALc8iLM1bq1F8B8" },
    { price: 75, id: "price_1NwtrUEFXALc8iLMfdwgyR89" },
    { price: 100, id: "price_1NwtreEFXALc8iLMGc0nAK57" },
  ];

  const buttons = values.map((button) => (
    <button
      className={`giftcard-button ${
        errorStates.button && `reserve-select-error`
      } ${activeButton === button.price && "giftcard-button-active"}`}
      key={button.id}
      id={button.id}
      type="button"
      onClick={(event) => handleClick(button)}
    >
      ${button.price}.00
    </button>
  ));

  const contactValidator = () => {
    let isError = false;
    if (!recipient) {
      setError((errorStates) => ({ ...errorStates, recipient: true }));
      isError = true;
    }
    if (!shipAddress) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, address: true }));
    }
    if (!activeButton) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, button: true }));
    }
    return isError;
  };

  const handleClick = (button) => {
    setError((errorStates) => ({ ...errorStates, button: false }));
    if (activeButton)
      document.getElementById(activeButton.id).className = "giftcard-button";
    if (activeButton?.id !== button.id)
      document.getElementById(button.id).className =
        "giftcard-button giftcard-button-active";
    if (activeButton?.id === button.id) setActiveButton(null);
    else setActiveButton(button);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      const giftCard = JSON.parse(localStorage.getItem("giftcard"));
      if (giftCard) {
        successfulGiftcardAlert();
        localStorage.removeItem("giftcard");
      }
    }
  }, []);

  async function saveGiftcard(newGiftcard) {
    localStorage.setItem("giftcard", JSON.stringify(newGiftcard));
  }

  async function createGiftcard() {
    const newGiftcard = {
      recipientName: recipient,
      shippingAddress: shipAddress,
      amount: activeButton.price,
      itemId: activeButton.id,
      email,
      message,
    };
    saveGiftcard(newGiftcard);
    return newGiftcard;
  }

  async function sendGiftcard(newGiftcard) {
    try {
      const response = await postGiftcard(newGiftcard);
      const body = response.data;
      window.location.href = body.url;
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async () => {
    if (!contactValidator()) sendGiftcard(await createGiftcard());
  };

  return (
    <>
      <form id="gc-form">
        <div className="reserve-top">Share the gift of Trattoria Demi!</div>
        <div className="reserve-container">
          <div className="reserve-section">
            <div className="menu-section-header">Order a giftcard</div>
            <img className="fancy-line" src={FancyLine} alt="" />
            <AnimatePresence>
              <motion.div {...fadeIn} className=" giftcard-inputs">
                <div className="giftcard-input">
                  <div className="input-group">
                    <label
                      className={`input-text ${
                        errorStates.button && `input-text-error`
                      }`}
                    >
                      {" "}
                      {inputText.button}{" "}
                    </label>
                    <div className="giftcard-buttons">{buttons}</div>
                  </div>
                  {Input(inputObjs.name)}
                  {Input(inputObjs.address)}
                  {Input(inputObjs.message)}
                  <button
                    className="submit-button mt-10"
                    type="button"
                    onClick={onSubmit}
                  >
                    Checkout with Stripe
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </form>
    </>
  );
}

export default Giftcard;

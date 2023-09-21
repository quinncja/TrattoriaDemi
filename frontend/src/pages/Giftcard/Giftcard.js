import { useEffect, useState } from "react";
import { postGiftcard } from "../../api.js"
import FancyLine from "../../images/FancyLine.png";
import { usePlacesWidget } from "react-google-autocomplete";
import {successfulGiftcardAlert} from "../../swal2.js"
const PLACES_KEY = process.env.REACT_APP_PLACES_KEY;


function Giftcard() {
  const [recipient, setRecipient] = useState(null);
  const [shipAddress, setShipAddress] = useState('');
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

  const { ref } = usePlacesWidget({
    apiKey: PLACES_KEY,
    options: {
      location: "42.0451%2C-87.6877°", 
      radius: 200, 
      types: "street-adress",
    },
    onPlaceSelected: (place) => {
      setShipAddress(place.formatted_address);
    }
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

  const values = [15, 25, 50, 75, 100];
  const buttons = values.map((value, index) => (
    <button
      className={`giftcard-button ${
        errorStates.button && `reserve-select-error`
      } ${activeButton === value && "giftcard-button-active"}`}
      key={index}
      id={value}
      type="button"
      onClick={(event) => handleClick(event.target.id)}
    >
      ${value}.00
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
      setMessage(event.target.value)
    }
    if (event.target.id === "email") {
      setError((errorStates) => ({ ...errorStates, email: false }));
      setError((errorStates) => ({ ...errorStates, emailFormat: false }));
      setEmail(event.target.value);
    }
  };

  const handleClick = (buttonId) => {
    setError((errorStates) => ({ ...errorStates, button: false }));
    if (activeButton)
      document.getElementById(activeButton).className = "giftcard-button";
    if (activeButton !== buttonId)
      document.getElementById(buttonId).className =
        "giftcard-button giftcard-button-active";
    if (activeButton === buttonId) setActiveButton(null);
    else setActiveButton(buttonId);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    console.log(query.get("success"))
    if (query.get("success")) {
      const giftCard = JSON.parse(localStorage.getItem('giftcard'));
      if (giftCard){
        successfulGiftcardAlert();
        localStorage.removeItem('giftcard');
      }
    }
  }, [])

  async function saveGiftcard(newGiftcard){
    localStorage.setItem('giftcard', JSON.stringify(newGiftcard));
  }

  async function createGiftcard() {
    const newGiftcard = { 
      recipientName: recipient,
      shippingAddress: shipAddress,
      amount: activeButton,
      email,
      message,
    }
    saveGiftcard(newGiftcard)
    return newGiftcard;
  }

  async function sendGiftcard(newGiftcard){
    try{
      const response = await postGiftcard(newGiftcard);
      const body = response.data;
      window.location.href = body.url;
    } catch (error){
      console.log(error)
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
          <div className="reserve-inputs giftcard-inputs">
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
              <div className="input-group">
                <label
                  className={`input-text ${
                    errorStates.recipient && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.recipient}
                </label>
                <input
                  type="text"
                  id="recipient"
                  className={`reserve-select ${
                    errorStates.recipient && `reserve-select-error`
                  }`}
                  onChange={(event) => handleChange(event)}
                ></input>
              </div>
              <div className="input-group">
                <div
                  className={`input-text ${
                    errorStates.address && `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.address}{" "}
                </div>
                <input
                  ref={ref}
                  type="text"
                  id="address"
                  value={shipAddress}
                  className={`reserve-select ${
                    errorStates.address && `reserve-select-error`
                  }`}
                  onChange={(event) =>  handleChange(event)}
                ></input>
              </div>
            </div>
            <div className="giftcard-input">
              <div className="input-group">
                <div className="input-text"> {inputText.message} </div>
                <textarea
                  type="text"
                  id="message"
                  placeholder="Optional"
                  className="reserve-select input-text-area gc-area"
                  onChange={(event) => handleChange(event)}
                ></textarea>
              </div>

              <button
                className="submit-button mt-10"
                type="button"
                onClick={onSubmit}
              >
                Checkout with Stripe
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}

export default Giftcard;

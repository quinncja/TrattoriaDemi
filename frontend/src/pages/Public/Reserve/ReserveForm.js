import React, { useState } from "react";
import Input from "components/Input";

function ReserveForm(props) {
  const createRes = props.createRes;
  const [name, setName] = useState(null);
  const [notes, setNotes] = useState(null);
  const [phone, setPhone] = useState(null);
  const [errorStates, setError] = useState({
    name: false,
    phone: false,
  });

  const inputText = {
    name: errorStates.name ? "Enter your name" : "Name",
    phone: errorStates.phone ? "Enter your phone number" : "Phone Number",
    message: "Additional Notes?",
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setError((errorStates) => ({ ...errorStates, phone: false }));
  };

  const handleChange = (event) => {
    if (event.target.id === "name") {
      setError((errorStates) => ({ ...errorStates, name: false }));
      setName(event.target.value);
    }
    if (event.target.id === "message") {
      setNotes(event.target.value);
    }
  };

  const onSubmit = () => {
    if (!reserveValidator()) createRes({ name, phone, notes, sendText: true });
  };

  const inputObjs = {
    name: {
      name: "name",
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
    message: {
      name: "message",
      id: "message",
      type: "textarea",
      text: inputText.message,
      handleChange,
    },
  };

  const reserveValidator = () => {
    let isError = false;
    if (!name) {
      setError((errorStates) => ({ ...errorStates, name: true }));
      isError = true;
    }
    if (!phone) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, phone: true }));
    }
    return isError;
  };

  return (
    <>
    <div>
      <div className="row flex-end mobile" style={{paddingBottom: "0px"}}>
        {Input(inputObjs.name)}
        {Input(inputObjs.phone)}
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: "10px", paddingTop: "15px"}}> 
        <span className="reserve-small-text"> • A confirmation text will be sent upon
        reserving. If you do not recieve a text, please call the restaurant to confirm your reservation.
        </span>
      </div>
      </div>
      <div> 
      {Input(inputObjs.message)}
      <div className="reserve-small-text" style={{paddingTop: "15px"}}>
        • Please note, outdoor seating is first come first serve.
      </div>
      </div>
      <button className="submit-button" type="button" onClick={onSubmit}>
        Reserve
      </button>
    </>
  );
}

export default ReserveForm;

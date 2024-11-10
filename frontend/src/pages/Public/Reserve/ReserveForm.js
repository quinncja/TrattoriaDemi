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
    if (!reserveValidator())
      createRes({ name, phone, notes, sendText: true });
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
      <div className="row flex-end mobile">
        {Input(inputObjs.name)}
        {Input(inputObjs.phone)}
      </div>
      {Input(inputObjs.message)}
      <div className="reserve-small-text">
        {" "}
        • Outdoor seating is first come first serve.
        <div className="br" />• Your reservation will be held for 10 minutes. Please contact us if your party is running late.  
        <div className="br" />• You will be sent a confirmation text upon reserving. Message and data rates may apply.

        <div className="br" />
        <div className="br" />

      </div>
      <button className="submit-button" type="button" onClick={onSubmit}>
        Reserve
      </button>
    </>
  );
}

export default ReserveForm;

import { useState } from "react";
import FancyLine from "../../images/FancyLine.png";
import "../Reserve/Reserve.css";
import { postContact } from "../../api";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorStates, setError] = useState({
    fname: false,
    lname: false,
    email: false,
    emailFormat: false,
    message: false,
  });

  const inputText = {
    fname: errorStates.fname ? "Please enter your first name" : "First Name",
    lname: errorStates.lname ? "Please enter your last name" : "Last Name",
    email: errorStates.email
      ? "Please enter your email"
      : errorStates.emailFormat
      ? "Please enter a valid email"
      : "Email",
    message: errorStates.message ? "Please enter a message" : "Your message",
  };

  function clearForm() {
    document.getElementById("contact-form").reset();
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setMessage(null);
  }

  async function createContact() {
    const newRes = {
      name: `${firstName.trimEnd()} ${lastName.trimEnd()}`,
      email,
      message,
    };
    const status = await postContact(newRes);
    if (status === 201) {
      clearForm();
    } else console.log(status);
  }

  function isValidEmail() {
    const regex = /^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const contactValidator = () => {
    let isError = false;
    if (!firstName) {
      setError((errorStates) => ({ ...errorStates, fname: true }));
      isError = true;
    }
    if (!lastName) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, lname: true }));
    }
    if (!message) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, message: true }));
    }
    if (!email) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, email: true }));
    }
    if (!isValidEmail()) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, emailFormat: true }));
    }
    return isError;
  };

  const onSubmit = () => {
    if (!contactValidator()) createContact();
  };

  const handleChange = (event) => {
    if (event.target.id === "fname") {
      setError((errorStates) => ({ ...errorStates, fname: false }));
      setFirstName(event.target.value);
    }
    if (event.target.id === "lname") {
      setError((errorStates) => ({ ...errorStates, lname: false }));
      setLastName(event.target.value);
    }
    if (event.target.id === "email") {
      setError((errorStates) => ({ ...errorStates, email: false }));
      setError((errorStates) => ({ ...errorStates, emailFormat: false }));
      setEmail(event.target.value);
    }
    if (event.target.id === "message") {
      setMessage(event.target.value);
      setError((errorStates) => ({ ...errorStates, message: false }));
    }
  };

  return (
    <form id="contact-form">
      <div className="reserve-top">Have questions? Get in touch below!</div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">Contact Us</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div className="reserve-inputs">
            <div className="input-group input-fname">
              <div
                className={`input-text ${
                  errorStates.fname && `input-text-error`
                }`}
              >
                {" "}
                {inputText.fname}{" "}
              </div>
              <input
                type="text"
                id="fname"
                className={`reserve-select ${
                  errorStates.fname && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
              ></input>
            </div>
            <div className="input-group input-lname">
              <div
                className={`input-text ${
                  errorStates.lname && `input-text-error`
                }`}
              >
                {" "}
                {inputText.lname}{" "}
              </div>
              <input
                type="text"
                id="lname"
                className={`reserve-select ${
                  errorStates.lname && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
              ></input>
            </div>
            <div className="input-group">
              <div
                className={`input-text ${
                  errorStates.message && `input-text-error`
                }`}
              >
                {" "}
                {inputText.message}{" "}
              </div>
              <textarea
                type="text"
                id="message"
                className={`reserve-select input-text-area ${
                  errorStates.message && `reserve-select-error`
                }`}
                onChange={(event) => handleChange(event)}
              ></textarea>
            </div>
            <div className="bottom-right-grid">
              <div className="input-group">
                <div
                  className={`input-text ${
                    (errorStates.email || errorStates.emailFormat) &&
                    `input-text-error`
                  }`}
                >
                  {" "}
                  {inputText.email}{" "}
                </div>
                <input
                  type="email"
                  id="email"
                  className={`reserve-select ${
                    (errorStates.email || errorStates.emailFormat) &&
                    `reserve-select-error`
                  }`}
                  onChange={(event) => handleChange(event)}
                ></input>
              </div>
              <button
                className="submit-button"
                type="button"
                onClick={onSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Contact;

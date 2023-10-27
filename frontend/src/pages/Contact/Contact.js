import { useState } from "react";
import FancyLine from "../../images/FancyLine.png";
import "../Reserve/Reserve.css";
import { postContact } from "../../api";
import { successfulContactAlert } from "../../swal2";
import { isValidEmail } from "../../functions";
import Input from "../../components/Input";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorStates, setError] = useState({
    name: false,
    email: false,
    emailFormat: false,
    message: false,
  });

  const inputText = {
    name: errorStates.name ? "Please enter your name" : "Name",
    email: errorStates.email
      ? "Please enter your email"
      : errorStates.emailFormat
      ? "Please enter a valid email"
      : "Email",
    message: errorStates.message ? "Please enter a message" : "Your message",
  };

  const handleChange = (event) => {
    if (event.target.id === "name") {
      setError((errorStates) => ({ ...errorStates, name: false }));
      setName(event.target.value);
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

  const inputObjs = {
    name: {
      name: "Name",
      id: "name",
      text: inputText.name,
      error: errorStates.name,
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
      error: errorStates.message,
      handleChange,
    },
  };

  function clearForm() {
    document.getElementById("contact-form").reset();
    setName(null);
    setEmail(null);
    setMessage(null);
  }

  async function createContact() {
    const newMes = {
      name,
      email,
      message,
    };
    const status = await postContact(newMes);
    if (status === 201) {
      clearForm();
      successfulContactAlert();
    } else console.log(status);
  }

  const contactValidator = () => {
    let isError = false;
    if (!name) {
      setError((errorStates) => ({ ...errorStates, name: true }));
      isError = true;
    }
    if (!message) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, message: true }));
    }
    if (!email) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, email: true }));
    }
    if (!isValidEmail(email)) {
      isError = true;
      setError((errorStates) => ({ ...errorStates, emailFormat: true }));
    }
    return isError;
  };

  const onSubmit = () => {
    if (!contactValidator()) createContact();
  };

  return (
    <form id="contact-form">
      <div className="reserve-top">Have questions? Get in touch below!</div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">Contact Us</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div className="contact-inputs">
            {Input(inputObjs.name)}
            {Input(inputObjs.email)}
            {Input(inputObjs.message)}
            <button className="submit-button" type="button" onClick={onSubmit}>
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Contact;

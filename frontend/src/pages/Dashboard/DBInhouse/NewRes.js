import { useState } from "react";
import useOutsideClick from "../../../components/useOutsideClick";
import PhoneInput from "react-phone-number-input/input";
import moment from 'moment-timezone';

function NewRes(props) {
  const close = props.close;
  const selfClose = props.selfClose;
  const submitRes = props.submitRes;

  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [numGuests, setGuests] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [notes, setNotes] = useState(null);

  const onSubmit = async () => {
    const newRes = {
      name,
      phone,
      numGuests,
      tableSize: "NA",
      date,
      time,
      notes,
      sendText: phone ? true : false,
      selfMade: true,
    };
    submitRes(newRes);
  };

  const closeOnOutsideClick = () => {
    selfClose();
    // Ask to confirm close if form has input
  };

  const ref = useOutsideClick(closeOnOutsideClick);

  const handleChange = (event) => {
    if (event.target.id === "name") {
      setName(event.target.value);
    }
    if (event.target.id === "phone") {
      setPhone(event.target.value);
    }
    if (event.target.id === "guests") {
      setGuests(event.target.selectedIndex);
    }
    if (event.target.id === "date") {  
      setDate(event.target.value);
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
    }
    if (event.target.id === "notes") {
      setNotes(event.target.value);
    }
  };

  return (
    <div className="opaque-background">
      <div className="reservations-header-mock">{close()}</div>
      <form className="new-res-form" id="new-res" ref={ref}>
        <div className="new-res-header"> New Reservation </div>
        <div className="new-res-top">
          <input
            className="new-res-input"
            id="name"
            placeholder="Name"
            onChange={(event) => handleChange(event)}
          ></input>
          <PhoneInput
            country="US"
            withCountryCallingCode={true}
            className="new-res-input"
            value={phone}
            onChange={(event) => {
              setPhone(event);
            }}
            placeholder="Phone #"
          />
        </div>
        <select
          className="new-res-input"
          id="guests"
          onChange={(event) => handleChange(event)}
        >
          <option default hidden value="">
            {" "}
            Party Size{" "}
          </option>
          <option>1 guest</option>
          {[...Array(14)].map((_, index) => (
            <option data={index + 2} key={index + 2}>
              {index + 2} guests
            </option>
          ))}
        </select>
        <input
          className="new-res-input"
          id="date"
          placeholder="Date"
          type="date"
          onChange={(event) => handleChange(event)}
        ></input>
        <input
          className="new-res-input"
          id="time"
          placeholder="Time"
          type="time"
          onChange={(event) => handleChange(event)}
        ></input>
        <input
          className="new-res-input"
          id="notes"
          placeholder="Notes"
          onChange={(event) => handleChange(event)}
        ></input>
        <button
          className="submit-button submit-new-res"
          type="button"
          onClick={() => {
            onSubmit();
          }}
        >
          Submit reservation
        </button>
      </form>
    </div>
  );
}

export default NewRes;

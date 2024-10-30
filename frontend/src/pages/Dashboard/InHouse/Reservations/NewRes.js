import { useState } from "react";
import PhoneInput from "react-phone-number-input/input";

function NewRes(props) {
  const close = props.close;
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

  const hourOptions = [
    "11:30am",
    "11:45am",
    "12:00pm",
    "12:15pm",
    "12:30pm",
    "12:45pm",
    "1:00pm",
    "1:15pm",
    "1:30pm",
    "1:45pm",
    "2:00pm",
    "2:15pm",
    "2:30pm",
    "2:45pm",
    "3:00pm",
    "3:15pm",
    "3:30pm",
    "3:45pm",
    "4:00pm",
    "4:15pm",
    "4:30pm",
    "4:45pm",
    "5:00pm",
    "5:15pm",
    "5:30pm",
    "5:45pm",
    "6:00pm",
    "6:15pm",
    "6:30pm",
    "6:45pm",
    "7:00pm",
    "7:15pm",
    "7:30pm",
    "7:45pm",
    "8:00pm",
    "8:15pm",
    "8:30PM",
    "8:45PM",
    "9:00PM",
  ];

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
    <div className="background">
      <form className="new-res-form" id="new-res">
        <div className="new-res-header"> New Reservation {close()} </div>
        <input
          className={`new-res-input  ${!name && "new-res-unselect"}`}
          id="name"
          value={name}
          placeholder="Name"
          autocomplete="off"
          onChange={(event) => handleChange(event)}
        />
        <div className="new-res-top">
          <PhoneInput
            country="US"
            withCountryCallingCode={true}
            className={`new-res-input  ${!phone && "new-res-unselect"}`}
            value={phone}
            autocomplete="off"
            onChange={(event) => {
              setPhone(event);
            }}
            placeholder="Phone #"
          />
        </div>
        <select
          className={`new-res-input  ${!numGuests && "new-res-unselect"}`}
          id="guests"
          onChange={(event) => handleChange(event)}
        >
          <option default hidden value="">
            {" "}
            Party Size{" "}
          </option>
          <option>1 guest</option>
          {[...Array(29)].map((_, index) => (
            <option data={index + 2} key={index + 2}>
              {index + 2} guests
            </option>
          ))}
        </select>
        <input
          className={`new-res-input  ${!date && "new-res-unselect"}`}
          id="date"
          placeholder="Date"
          type="date"
          onChange={(event) => handleChange(event)}
        />

        <select
          className={`new-res-input  ${!time && "new-res-unselect"}`}
          id="time"
          onChange={(event) => handleChange(event)}
        >
          <option default hidden value="">
            {" "}
            Time{" "}
          </option>
          <option>1 guest</option>
          {hourOptions.map((hour, index) => (
            <option data={hour} key={hour}>
              {hour}
            </option>
          ))}
        </select>
        <textarea
          className="new-res-input text-area-res"
          id="notes"
          placeholder="Notes"
          onChange={(event) => handleChange(event)}
        />
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

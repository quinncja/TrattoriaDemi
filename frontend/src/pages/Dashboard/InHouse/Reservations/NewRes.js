import { convertTo12Hour, convertTo24Hour } from "functions";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input/input";
import { openBookSvg, peopleSvg } from "svg";
import { dateToString } from "dateUtils";
import { dotPulse } from 'ldrs'
import { AnimatePresence, motion } from "framer-motion";
import { fadeInModal } from "animations";
import { checkReservation } from "api";
import { toast } from "sonner";
import { TZDate } from "@date-fns/tz";

dotPulse.register()

function NewRes(props) {
  const { submitRes, setNewRes, submitting, defaultDate} = props;
  const year = defaultDate.getFullYear();
  const month = (defaultDate.getMonth()).toString().padStart(2, '0');
  const day = defaultDate.getDate().toString().padStart(2, '0');
  
  const timeZone = 'America/Chicago';
  const chicagoDate = new TZDate(year, month, day, timeZone);

  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [numGuests, setGuests] = useState(null);
  const [date, setDate] = useState(chicagoDate);
  const [time, setTime] = useState(null);
  const [notes, setNotes] = useState(null);
  const [response, setResponse] = useState(null);

  function sortResponse(array) {
    array.sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);

      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      } else {
        return timeA[1] - timeB[1];
      }
    });
    return array;
  }

  const tableText = response ? response.available ? "Available" : "Potentially overbooked" : null;
  const tfClass = response ? response.available ? "green" : "red" : "";
  const tfOptions = response ? response.available ? null :  sortResponse(response.suggestions) : null;

  const tableSizes = {
    1: ["2top"],
    2: ["2top"],
    3: ["3top", "4top"],
    4: ["4top", "6top"],
    5: ["6top"],
    6: ["6top"],
    7: ["6top"],
    8: ["6top"],
    9: ["xl"],
    10: ["xl"],
    11: ["xl"],
    12: ["xl"],
    13: ["xl"],
    14: ["xl"],
    15: ["xl"],
    16: ["xl"],
    17: ["xl"],
    18: ["xl"],
    19: ["xl"],
    20: ["xl"],
    21: ["xl"],
    22: ["xl"],
    23: ["xl"],
    24: ["xl"],
    25: ["xl"],
    26: ["xl"],
    27: ["xl"],
    28: ["xl"],
    29: ["xl"],
    30: ["xl"],
  };

  useEffect(() => {
  const abortController = new AbortController();
  const signal = abortController.signal;

  const fetchChecker = async () => {
    try {
      const response = await checkReservation(numGuests, date, convertTo24Hour(time), signal);
      setResponse(response);
    } catch (error) {
      toast.error("Failed to check table availability");
    }
  };
  if (numGuests && date && time) fetchChecker();

  return () => {
    abortController.abort();
  };
}, [numGuests, date, time]);

  const getTableSize = (numGuests) => {
    return(tableSizes[numGuests][0])
  }
  const onSubmit = async () => {
    const newRes = {
      name,
      phone,
      numGuests,
      tableSize: getTableSize(numGuests),
      date,
      time: convertTo24Hour(time),
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
    if (event.target.id === "date") {
      const dateArr = event.target.value.split('-')
      const newDate = new Date( Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2]) )
      setDate(newDate);
    }
    if (event.target.id === "guests") {
      setGuests(event.target.selectedIndex);
    }
    if (event.target.id === "time") {
      setTime(event.target.value);
    }
    if (event.target.id === "notes") {
      setNotes(event.target.value);
    }
  };

  const handleAltClick = (time) => {
    setTime(time)
    setResponse({available: true})
  }

  const closeResButton = () => {
    return (
      <button
        onClick={() => setNewRes(!true)}
        type="button"
        className="new-res-btn2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 -2 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L18 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  return (
    <motion.div className="background" {...fadeInModal}>
      <form className="new-res-form" id="new-res">
        <div className="new-res-header">
          {" "}
          New Reservation {closeResButton()}{" "}
        </div>
        <motion.div className="new-res-inputs" layout>

          <motion.div 
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`new-res-input-group ${tfClass}-border`}>
            <motion.label layout="position" className="new-res-label"> {openBookSvg()} Table Info 
              <AnimatePresence 
                transition={{ ease: "linear", duration: .2}} 
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0 }}> 
                {tableText && <> <motion.span layout=""> - </motion.span> <motion.span layout="" className={tfClass}> {tableText} </motion.span> </>}
              </AnimatePresence>
            </motion.label>
            <motion.select
            layout="position"
              className={`new-res-input  ${!numGuests && "new-res-unselect"}`}
              id="guests"
              onChange={(event) => handleChange(event)}
            >
              <option default hidden value="">
                {" "}
                Party Size{" "}
              </option>
              <option> 1 guest </option>
              {[...Array(29)].map((_, index) => (
                <option data={index + 2} key={index + 2}>
                  {index + 2} guests
                </option>
              ))}
            </motion.select>

            <motion.div> 
              <motion.label layout="position" className="date-label" htmlFor="date">
                {" "}
                {date ? dateToString(date) : "Date"}{" "}
              </motion.label>
              <motion.input
              layout="position"
                className={`new-res-input  ${!date && "new-res-unselect"}`}
                id="date"
                type="date"
                onChange={(event) => handleChange(event)}
              />
            </motion.div> 

            <motion.select
            layout="position"
              className={`new-res-input  ${!time && "new-res-unselect"}`}
              id="time"
              onChange={(event) => handleChange(event)}
              value={time || "Time"}
            >
              <option default hidden value="" key={"default"}>
                  Time
              </option>
              {hourOptions.map((hour, index) => (
                <option value={convertTo24Hour(hour)} data={hour} key={hour}>
                  {hour}
                </option>
              ))}
            </motion.select>

              
            <AnimatePresence> 
            {response && !response.available && (
              tfOptions.length > 0 ? (
                <motion.div className="suggested-alternatives" 
                layout
                transition={{ ease: "linear", duration: .3}} 
                style={{ overflow: 'hidden' }}
                initial={{ opacity: 0, y: -10, height: 0,  marginBottom: "0rem"  }}
                animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: "2rem"  }}
                exit={{ opacity: 0, y: -10, height: 0,  marginBottom: "0rem"  }}
                > 
                  <span className="sug-alt"> Alternative times </span>
                  <div className="alternatives">
                    {tfOptions.map((option) => (
                      <motion.button key={option.time} type="button" onClick={() => handleAltClick(option.time)}>
                        {convertTo12Hour(option.time)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div className="suggested-alternatives" 
                layout
                transition={{ ease: "linear", duration: .3}} 
                style={{ overflow: 'hidden' }}
                initial={{ opacity: 0, y: -10, height: 0,  marginBottom: "0rem"  }}
                animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: "2rem"  }}
                exit={{ opacity: 0, y: -10, height: 0,  marginBottom: "0rem"  }}
                > 
                  <motion.span layout="position" className="sug-alt"> No alternative times to recommend </motion.span>
                </motion.div>
              )
            )}
            </AnimatePresence> 

          </motion.div>

          <motion.div className="new-res-input-group" layout="position">
            <motion.label layout="position" className="new-res-label"> {peopleSvg()} Guest Info</motion.label>
            <motion.input
            layout="position"
              className={`new-res-input  ${!name && "new-res-unselect"}`}
              id="name"
              value={name}
              placeholder="Name"
              autoComplete="off"
              onChange={(event) => handleChange(event)}
            />
            <motion.div className="new-res-top" layout="position">
              <PhoneInput
                country="US"
                withCountryCallingCode={true}
                className={`new-res-input  ${!phone && "new-res-unselect"}`}
                value={phone}
                autoComplete="off"
                pattern="\d*"
                onChange={(event) => {
                  setPhone(event);
                }}
                placeholder="Phone #"
              />
            </motion.div>

            <motion.textarea
            layout="position"
              className="new-res-input text-area-res"
              id="notes"
              placeholder="Notes"
              onChange={(event) => handleChange(event)}
            />
          </motion.div>
        </motion.div>
        <button
          className={`${submitting ? "loading-button" : ""} submit-button submit-new-res`}
          type="button"
          onClick={() => {
            onSubmit();
          }}
        >
          {submitting ? 
            <l-dot-pulse
              size="50"
              speed="1.6" 
              color="white" 
            ></l-dot-pulse> :
            "Submit reservation" }
        </button>
      </form>
    </motion.div>
  );
}

export default NewRes;

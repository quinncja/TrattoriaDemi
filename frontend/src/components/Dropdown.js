import React, { useState, useRef, useEffect } from "react";
import {
    convertTo12Hour,
  } from "../functions";

function Dropdown(props) {
  const { options, selected, onSelect, id, svg } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown ${isOpen && `dropdown-open`}`} ref={dropdownRef}>
      <button type="button" className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {svg()}  {selected ? id === "time" ? convertTo12Hour(selected) : selected : "Select"}
      </button>
      { isOpen ? !options ?
       <div className="dropdown-menu">
         <div className="dropdown-line"/>
         <button
           id={id}
           className="dropdown-item item-disabled disabled"
           type="button"
         >
           Select a date first
         </button>
     </div> 
     :
        <div className="dropdown-menu">
          {options.map((option) => (
            <>
            <div className="dropdown-line"/>
            <button
              key={option.value} 
              id={id}
              value={option.value}
              type="button"
              className={`dropdown-item ${option.disabled ? "item-disabled disabled" : ""}`}
              onClick={option.disabled ? "" : (option) => handleSelect(option)}
            >
              {option.label}
            </button>
            </>
          ))}
        </div> : ""
      }
    </div>
  );
}

export default Dropdown;
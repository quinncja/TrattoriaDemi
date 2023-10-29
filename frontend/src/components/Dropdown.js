import React, { useState, useRef, useEffect } from "react";
import {
    convertTo12Hour,
  } from "../functions";
  import { useMobile } from "../context/MobileContext";
  import { motion, AnimatePresence } from "framer-motion";
function Dropdown(props) {
  const { object, selected, onSelect, id, svg } = props;
  const mobile = useMobile();
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
      <AnimatePresence>
      { isOpen ? !object.options ?
       <motion.div className="dropdown-menu">
         <button
           id={id}
           className="dropdown-item item-disabled disabled"
           type="button"
         >
           Select a date first
         </button>
     </motion.div> 
     :
        <motion.div className="dropdown-menu mobile-menu">
        {mobile &&
          <div className="dropdown-header">
              {svg()} {object.name}
          </div>
        }
        <div className="items-container">
          {object.options.map((option) => (
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
          ))}
        </div>
        </motion.div> : ""
      }
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
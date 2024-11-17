import React, { useState, useRef, useEffect } from "react";
import { convertTo12Hour } from "../functions";
import { AnimatePresence, motion } from "framer-motion";
import { cancelSvg } from "svg";
import { fadeInModal } from "animations";
function Dropdown(props) {
  const { object, selected, onSelect, id, svg, isMobile } = props;
  const [isOpen, setIsOpenState] = useState(false);
  const dropdownRef = useRef(null);

  const setIsOpen = (open) => {
    if (isMobile) document.body.classList.toggle("no-scroll", open);
    setIsOpenState(open);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };
  const fadeOut = {
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <AnimatePresence>
    <div
      className={`dropdown ${isOpen && !isMobile && `dropdown-open`}`}
      ref={dropdownRef}
    >
      <motion.button
        type="button"
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {svg()}{" "}
        {selected
          ? id === "time"
            ? convertTo12Hour(selected)
            : selected
          : "Select"}
      </motion.button>
      {isOpen ? (
        !object.options ? (
          <>
            <div
              className={`faux-overlay ${isMobile && "faux-overlay-mobile"}`}
            />
            <motion.div className="dropdown-menu">
              <button
                id={id}
                className="dropdown-item item-disabled disabled"
                type="button"
              >
                Select a date first
              </button>
            </motion.div>
          </>
        ) : object.options.length === 0 ? (
          <>
            <div
              className={`faux-overlay ${isMobile && "faux-overlay-mobile"}`}
            />
            <motion.div className="dropdown-menu">
              <button
                id={id}
                className="dropdown-item item-disabled disabled"
                type="button"
              >
                No available time slots
              </button>
            </motion.div>
          </>
        ) : (
          <>
            {!isMobile && <div className="faux-overlay" />}
            <motion.div className={!isMobile ? "dropdown-menu" : "mobile-menu"}  {...(isMobile ? fadeInModal : {})}>
              {isMobile && (
                <>
                  <div className="dropdown-header">
                    <div style={{ width: "30px" }} />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {svg()} {object.name}
                    </div>
                    <button
                      className="dropdown-header-button"
                      onClick={() => setIsOpen(false)}
                    >
                      {cancelSvg()}
                    </button>
                  </div>
                </>
              )}
              <div className="items-container">
                {object.options.map((option) => (
                  <motion.button
                    exit={fadeOut}
                    key={option.value}
                    id={id}
                    value={option.value}
                    type="button"
                    className={`dropdown-item ${
                      isMobile && "dropdown-item-mobile"
                    } ${
                      option.disabled
                        ? `item-disabled disabled ${
                            isMobile && "item-disabled-mobile"
                          }`
                        : ""
                    }`}
                    onClick={
                      option.disabled
                        ? () => {}
                        : (option) => handleSelect(option)
                    }
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              {isMobile && <div className="dropdown-footer" />}
            </motion.div>
          </>
        )
      ) : (
        ""
      )}
    </div>
    </AnimatePresence>
  );
}

export default Dropdown;

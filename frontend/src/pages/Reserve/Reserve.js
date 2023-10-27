import React, { useState, useRef } from "react";
import FancyLine from "../../images/FancyLine.png";
import "./Reserve.css";
import { postReservation } from "../../api";
import { successfulReserveAlert } from "../../swal2";
import TableFinder from "./TableFinder";
import ReserveForm from "./ReserveForm";
import { motion, AnimatePresence } from "framer-motion";
export default function Reserve() {
  const [table, setTable] = useState(null);
  const childRef = useRef(null);

  async function createRes(formData) {

    const newRes = {
      ...table,
      ...formData
    };
    
    const status = await postReservation(newRes);
    if (status === 201) {
      successfulReserveAlert();
      setTable(null)
      childRef.current.reset();
    } else console.log(status);
  }

  return (
    <form id="res-form">
      <div className="reserve-top">
        Reserve a table below or by phone at 847-332-2330
      </div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">For a Reservation</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <div className="reserve-inputs">
            <TableFinder table={table} setTable={setTable} ref={childRef}/>
            {table && (
              <AnimatePresence>
                <motion.div
                  className="res-info"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ReserveForm createRes={createRes} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

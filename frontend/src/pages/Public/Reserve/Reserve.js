import React, { useState } from "react";
import FancyLine from "images/FancyLine.png";
import "./Reserve.css";
import { postReservation } from "api";
import TableFinder from "./TableFinder";
import ReserveForm from "./ReserveForm";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "animations";
import FoundTable from "./FoundTable";
import { useNavigate } from "react-router-dom";

export default function Reserve() {
  const [editing, setEditing] = useState(false);
  const [table, setTable] = useState(null);
  const navigate = useNavigate();

  async function createRes(formData) {
    const newRes = {
      ...table,
      ...formData,
    };

    const response = await postReservation(newRes);
    if (response.status === 201) {
      const id = response.data._id;
      navigate(`/res/${id}/?success`);
    } else console.log(response.status);
  }

  const returnToEdit = () => {
    setTable((prevTable) => ({
      ...prevTable,
      time: "",
    }));
    setEditing(true);
  };

  return (
    <form id="res-form">
      <div className="reserve-top">
        Reserve a table below or by phone at 847-332-2330
      </div>
      <div className="reserve-container">
        <div className="reserve-section">
          <div className="menu-section-header">For a Reservation</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          {(!table || editing) && (
            <div className="table-finder-container">
              <TableFinder
                table={table}
                setTable={setTable}
                editing={editing}
                setEditing={setEditing}
              />
            </div>
          )}
          <div className="reserve-inputs">
            {table && !editing && (
              <AnimatePresence>
                <motion.div className="res-info" {...fadeInDown}>
                  <FoundTable table={table} setEditing={returnToEdit} />
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

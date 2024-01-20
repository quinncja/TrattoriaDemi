import { convertTo12Hour, dateToString } from "functions";
import { fadeInDown } from "animations";
import { motion, AnimatePresence } from "framer-motion";
import { calendarSvg, peopleSvg, clockSvg } from "svg";

function FoundTable(props) {
  const { table, setEditing } = props;
  const { numGuests, date, time } = table;

  return (
    <AnimatePresence>
      <motion.div {...fadeInDown}>
        <div className="input-text"> Your table </div>
        <div className="found-table">
          <div className="table-info">
            {peopleSvg()}
            {numGuests}
          </div>
          <div className="table-info">
            {calendarSvg()}
            {dateToString(date)}
          </div>
          <div className="table-info">
            {clockSvg()}
            {convertTo12Hour(time)}
          </div>
          <button
            className="edit-btn"
            type="button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FoundTable;

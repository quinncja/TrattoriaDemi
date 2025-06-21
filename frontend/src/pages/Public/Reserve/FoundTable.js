import { convertTo12Hour } from "functions";
import { fadeIn } from "animations";
import { motion, AnimatePresence } from "framer-motion";
import { calendarSvg, peopleSvg, clockSvg } from "svg";
import { dateToString } from "dateUtils";

function FoundTable(props) {
  const { table, setEditing, inRes } = props;
  const { numGuests, date, time } = table;

  console.log(table);

  return (
    <AnimatePresence>
      <motion.div {...fadeIn} className={`${inRes && "inResTable"}`}>
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
        <div style={{paddingTop: "15px"}}> 
          <span className="reserve-small-text" style={{fontWeight: '400'}}>• Your reservation will be held for <span style={{fontWeight: "800", fontSize: "17px"}}> 10 minutes. </span> Please contact us by phone if your party is running late. </span>  
        </div>
      </motion.div>
      
    </AnimatePresence>
  );
}

export default FoundTable;

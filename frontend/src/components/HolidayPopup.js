import { motion } from "framer-motion";
import { cancelSvg } from "svg";
import "css/snowfall.css"
import { useState } from "react";
import fancyLine from "images/FancyLine.png"
import holidayScene from "images/tree&menorah.png"

function HolidayPopup(){
    const [open, setOpen] = useState(false);

    const snow = () => {
        return(
            <div class="initial-snow">
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
            <div class="snow">&#10052;</div>
        </div>
    
        )
    }

    const openBody = () => {
        return(
            <div className="open-body">
                <img className="fancy-line holiday-line" src={fancyLine} alt="" />
                <div className="holiday-text"> Happy Holidays from our family to yours </div>
            <div className="hours">
                <div className="date"> Dec 24th </div>
                <div className="time"> 12:00pm - 8:00pm </div>

                <div className="date"> Dec 25th </div>
                <div className="time"> Closed </div>

                <div className="date"> Dec 26th </div>
                <div className="time"> 4:00pm - 8:30pm </div>

                <div className="date"> Dec 31st </div>
                <div className="time"> 12:00pm - 8:00pm </div>

                <div className="date"> Jan 1st </div>
                <div className="time"> 4:00pm - 8:30pm </div>
            </div>
            </div>
        )
    }
    
    return(
        <div className={`popup-container ${open ? "popup-container-open" : ""}`} onClick={open ? () => setOpen(false) : () => {}}> 
        <motion.div className={`popup-banner ${open ? "popup-banner-open" : ""}`}  onClick={!open ? () => setOpen(true) : () => {}}>
            {open && snow()}
            <motion.div className="popup-header"> 
                Holiday Hours {!open && <span> &#10052; </span>}
            </motion.div>
            {open && openBody()}
            <img className={`holiday-scene ${open && `holiday-open`}`} src={holidayScene} alt=""/>
            {open && <button className="holiday-close" onClick={() => setOpen(false)}> {cancelSvg()} </button>}
            {open &&
            <> 
            <div class="custom-shape-divider-bottom-1733342417">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
            </svg>
            </div>
            <div class="custom-shape-divider-bottom-1733340706">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
                </svg>
            </div>
            </>}
        </motion.div>
        </div>
    )
}

export default HolidayPopup;
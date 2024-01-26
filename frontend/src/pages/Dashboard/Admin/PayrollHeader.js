import { calculateDates } from "functions";
import React, { useState, useEffect} from "react";
import { leftArrow, rightArrow } from "svg";


function PayrollHeader({handleClick, currentPeriod, setCurrentPeriod}){
    const [dates, setDates] = useState([])

    useEffect(() => {
       setDates(calculateDates(currentPeriod))
    }, [currentPeriod])


    return(
        <div className="payroll-header">
            <div> 
                <div className="dbn-name">
                    Payroll Period
                </div>
                <div className="payroll-dates">
                    {dates[0]} - {dates[1]}
                </div>
            </div>
            <div className="right-row"> 
            <div className="payroll-date-buttons"> 
            <button className="date-changer-btn dcbb" onClick={currentPeriod > 1 ? () => setCurrentPeriod(currentPeriod - 1) : () => {return}}>
                {leftArrow()}
            </button>
            <button className="date-changer-btn dcbf" onClick={() => setCurrentPeriod(currentPeriod + 1)}>

                {rightArrow()}
            </button>
            </div>
            <button className="submit-button less-height" type="button" onClick={handleClick}> Save </button>
            </div>
        </div>
        
    )
}

export default PayrollHeader;
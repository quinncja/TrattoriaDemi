import React, { useState, useEffect} from "react";
import { leftArrow, rightArrow } from "svg";


function PayrollHeader({handleClick, currentPeriod, setCurrentPeriod}){
    const [dates, setDates] = useState([])

    useEffect(() => {
        calculateDates(currentPeriod)
    }, [currentPeriod])


    function calculateDates(periodNumber) {
        const baseDate = new Date('2024-01-01');
    
        const endDate = new Date(baseDate);
        endDate.setDate(baseDate.getDate() + (periodNumber * 14) );
    
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 13);
    
        const formatDate = (date) => {
            let dd = date.getDate();
            let mm = date.getMonth() + 1;
            const yyyy = date.getFullYear().toString()
    
            if(dd < 10) {
                dd = '0' + dd;
            } 
            if(mm < 10) {
                mm = '0' + mm;
            } 
    
            return mm + '/' + dd + '/' + yyyy;
        }

        setDates([formatDate(startDate), formatDate(endDate)])
    }

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
import { calculateDates } from "functions";
import { forwardRef } from "react";

const PayrollPdf = forwardRef((props, ref) => {
    const { payrollData, currentPeriod } = props;
    const emptyData = {
        employee: {
            name: "",
            rate: [{rate: ""}]
        },
        hours: "",
        gross: "",
        ficaAmnt: "",
        stateAmnt: "",
        federalAmnt: "",
        netWage: "",
    }
    const dates = calculateDates(currentPeriod);

    function safeToFixed(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            return value.toFixed(2);
        } else {
            return ""
        }
    }

    function employeeCard({employee, ...values}) {
        return(
            <div key={employee.employee} className="employee-box"> 
            <div className="bold">
                {employee.name}
            </div>
            <div>
                Pay period: {dates[0]} - {dates[1]}
            </div>
            <div>
                Total hours: {values.hours}
            </div>
            <div>
                Hourly rate: ${safeToFixed(employee.rate[0].rate)} {employee.rate[1] && `($${safeToFixed(values.hours * employee.rate[0].rate)})`}
            </div>
            {employee.rate[1] && 
            <> 
            <div>
                Total hours: {values.secondHours}
            </div>
            <div>
                Hourly rate: ${safeToFixed(employee.rate[1].rate)} (${safeToFixed(values.secondHours * employee.rate[1].rate)}) 
            </div>
             </>
            }
            {values.tips &&
            <div>
                Tips: ${values.tips}
            </div>}
            <div>
                Gross wages: ${safeToFixed(values.tips ? values.tips + values.gross : values.gross)}
            </div>
            <div>
                Fica: ${safeToFixed(values.ficaAmnt)}
            </div>
            <div>
                State: ${safeToFixed(values.stateAmnt)}
            </div>
            <div>
                Federal: ${safeToFixed(values.federalAmnt)}
            </div>
            {employee.loan && 
                <div>
                    Loan: ${safeToFixed(values.loanAmnt)}
                </div>
            }
            {employee.ilChoice && 
                <div>
                    IL Secure Choice: ${safeToFixed(values.ilChoice)}
                </div>
            }
            <div>
                Net wages: ${safeToFixed(values.netWage)}
            </div>
            </div>
        )
    }

    return (
        <div ref={ref} className="payroll-pdf"> 
        {payrollData.payrolls.map((row) => {
            return(employeeCard(row));
        })}
        {employeeCard(emptyData)}
        
        </div>
    );
});

export default PayrollPdf;
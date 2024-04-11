import { calculateDates } from "functions";
import { forwardRef } from "react";

const PayrollPdf = forwardRef((props, ref) => {
    const { payrollData, currentPeriod } = props;
    const dates = calculateDates(currentPeriod);

    function safeToFixed(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            return value.toFixed(2);
        } else {
            return value;
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
                Total hours: {values.hours[0]}
            </div>
            <div>
                Hourly rate: ${safeToFixed(values?.rates[0])} {values?.rates[1] && `($${safeToFixed(values.hours[0] * values?.rates[0])})`}
            </div>
            {employee?.rates[1] && 
            <> 
            <div>
                Total hours: {values.hours[1]}
            </div>
            <div>
                Hourly rate: ${safeToFixed(values?.rates[1])} (${(safeToFixed(values.hours[1] * values?.rates[1]) || "0.00")}) 
            </div>
             </>
            }
            {(employee.tips) &&
            <div>
                Tips: ${values.gross[1] || "0.00"}
            </div>}
            <div>
                Gross wages: ${safeToFixed(values.gross[0] + values.gross[1]) || "0.00"}
            </div>
            <div>
                Fica: ${safeToFixed(values.fica)}
            </div>
            <div>
                State: ${safeToFixed(values.state)}
            </div>
            <div>
                Federal: ${safeToFixed(values.federal)}
            </div>
            {employee.loan && 
                <div>
                    Loan: ${safeToFixed(values.loan.amount) || "0.00"}
                </div>
            }
            {employee.ilChoice && 
                <div>
                    IL Secure Choice: ${safeToFixed(values.ilChoice)}
                </div>
            }
            <div>
                Net wages: ${safeToFixed(values.net)}
            </div>
            </div>
        )
    }

    return (
        <div ref={ref} className="payroll-pdf"> 
        {payrollData.payments.map((row) => {
            return(employeeCard(row));
        })}  
        </div>
    );
});

export default PayrollPdf;
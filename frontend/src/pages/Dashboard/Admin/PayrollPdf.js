import { forwardRef } from "react";

const PayrollPdf = forwardRef((props, ref) => {
    const { payrollData } = props;

    function safeToFixed(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            return value.toFixed(2);
        } else {
            return ""
        }
    }

    return (
        <div ref={ref} className="payroll-pdf"> 
        {payrollData.payrolls.map((row) => {
            const { employee, ...values } = row;
            return(
                <div key={employee.employee} className="employee-box"> 
                <div className="bold">
                    {employee.employee}
                </div>
                <div>
                    Total Hours: {values.hours}
                </div>
                <div>
                    Hourly Rate: ${safeToFixed(employee.rate[0].rate)} {employee.rate[1] && `($${safeToFixed(values.firstgross)} )`}
                </div>
                {employee.rate[1] && 
                <> 
                <div>
                    Total Hours: {values.secondHours}
                </div>
                <div>
                    Hourly Rate: ${safeToFixed(employee.rate[1].rate)} (${safeToFixed(values.secondgross)} ) 
                </div>
                 </>
                }
                <div>
                    Gross wages: ${safeToFixed(values.gross)}
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
                {employee.il && 
                    <div>
                        Il Secure Choice: ${safeToFixed(values.ilChoice)}
                    </div>
                }
                <div>
                    Net wages: ${safeToFixed(values.netWage)}
                </div>
                </div>
            )
        })}
        </div>
    );
});

export default PayrollPdf;
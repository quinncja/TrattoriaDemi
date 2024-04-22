import { calculateDates, formatDates } from "functions"

function OldPayrolls({ data, clickHandler}) {
    const lastEightEntries = data ? data.slice(-8) : [];

    return (
        <div className="old-payrolls">
            {lastEightEntries.reverse().map((payroll, index) => {
                const originalIndex = data.length - lastEightEntries.length + index;
                return (
                    <button className="old-payroll" key={originalIndex} onClick={() => clickHandler(payroll.x)}>
                        <div>{formatDates(calculateDates(payroll.x))}</div>
                        <div>{`$${payroll.y.toLocaleString()}`}</div>
                    </button>
                );
            })}
        </div>
    )
}

export default OldPayrolls;
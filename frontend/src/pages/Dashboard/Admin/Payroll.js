import { getPayrollByPeriod, savePayroll } from "api";
import React, { useState, useEffect, useRef} from "react";
import { useReactToPrint } from 'react-to-print';
import PayrollRow from "./PayrollRow";
import PayrollPdf from "./PayrollPdf";
import PayrollHeader from "./PayrollHeader";

function Payroll(){
    const [payrollData, setPayrollData] = useState(null);
    const [currentPeriod, setCurrentPeriod] = useState();
    const payrollRowRefs = useRef([]);
    const componentRef = useRef();

    function getCurrentPeriod() {
        const baseDate = new Date('2024-01-01T00:00:00-06:00');
    
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const centralTime = new Date(today.getTime() - offset - 6 * 3600000); 
    
        const diffTime = Math.abs(centralTime - baseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        const currentPeriod = Math.ceil(diffDays / 14);
        setCurrentPeriod(currentPeriod)
    }

    useEffect(() => {
        getCurrentPeriod();
    }, [])

    useEffect(() => {
        const loadPayroll = async () => {
            const payrollData = await getPayrollByPeriod(currentPeriod);
            payrollRowRefs.current = payrollData.payrolls.map(() => React.createRef());
            setPayrollData(payrollData)
        }
        if(currentPeriod) loadPayroll();
    }, [currentPeriod])

    const handleItemChange = (index, field, value, net) => {
        setPayrollData((prevData) => {
            const newData = { ...prevData };
            newData.payrolls[index] = { ...newData.payrolls[index], [field]: value, netWage: net };
            return newData;
        });
    };

    const handleRowChange = (rowIndex, newRowData) => {
        setPayrollData(prevData => {
            const newData = { ...prevData };
            newData.payrolls[rowIndex] = { ...newData.payrolls[rowIndex], ...newRowData, employee: newData.payrolls[rowIndex].employee };
            return newData;
        });
    };

    const handleSave = () => {
        savePayroll(payrollData)
        print();
    };

    const print = useReactToPrint({
        content: () => componentRef.current,
      });

    return(
        <>
        <PayrollHeader handleClick={handleSave} currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod}/>
        {payrollData && payrollData.payrolls.map((row, index) => {
            return(
                <PayrollRow key={row.employee.id} row={row} index={index} handleRowChange={handleRowChange} handleItemChange={handleItemChange} />            
            )
        })}

        <div className="payroll-pdf-hider"> 
        {payrollData && <PayrollPdf payrollData={payrollData} ref={componentRef}/>}
        </div> 
        </>
    )
}

export default Payroll;
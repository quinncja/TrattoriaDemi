import { getPayrollByPeriod, savePayroll } from "api";
import React, { useState, useEffect, useRef} from "react";
import { useReactToPrint } from 'react-to-print';
import PayrollPdf from "./PayrollPdf";
import PayrollHeader from "./PayrollHeader";
import PayrollEditor from "./PayrollEditor";
import { fadeIn, loadingAnimation } from "animations";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

function Payroll(){
    const [payrollData, setPayrollData] = useState(null);
    const [newData, setNewData] = useState(null);
    const [editing, setEditing] = useState(true);
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
        setCurrentPeriod(currentPeriod - 1)
    }

    useEffect(() => {
        getCurrentPeriod();
    }, [])

    useEffect(() => {
        const loadPayroll = async () => {
            setPayrollData()
            const payrollData = await getPayrollByPeriod(currentPeriod);
            if(payrollData.total) setEditing(false)
            else setEditing(true)
            payrollRowRefs.current = payrollData.payments.map(() => React.createRef());
            setPayrollData(payrollData)
        }
        if(currentPeriod) loadPayroll();
    }, [currentPeriod])

    const handleEdit = () => {
        setEditing(!editing)
    }
    const handleEditedData = (newData) => {
        setPayrollData(newData);
    };
    
    const handleSave = async () => {
       try {
        const returnPayroll = await savePayroll(newData)
        setPayrollData(returnPayroll)
       } catch (error) {
        console.log(error)
        return;
       }
        setEditing(false)
    };

    const handlePrint = () => {
        print();
    }

    const print = useReactToPrint({
        content: () => componentRef.current,
    });

    const sortPayroll = (payrollData) => {
        if(payrollData?.payments){
            payrollData.payments.sort((a, b) => {
                const lastNameA = a.employee.name.split(' ').pop().toLowerCase();
                const lastNameB = b.employee.name.split(' ').pop().toLowerCase();
        
                if (lastNameA > lastNameB) return 1;
                if (lastNameA < lastNameB) return -1;
                return 0;
            });

            return payrollData;
        }
    }
    return(
        <>
        <PayrollHeader editing={editing} isNew={!payrollData?.total} handleEditedData={handleEditedData} handleEdit={handleEdit} handleClick={handleSave} handlePrint={handlePrint} currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod}/>
        <AnimatePresence> 
        {payrollData ? 
            editing ? 
                <PayrollEditor payrollData={sortPayroll(payrollData)} currentPeriod={currentPeriod} setNewData={setNewData}/> :
                <motion.div {...fadeIn} className="saved-payroll">
                <PayrollPdf payrollData={sortPayroll(payrollData)} currentPeriod={currentPeriod} ref={componentRef}/>
                </motion.div>
            : 
                loadingAnimation()
        }
        </AnimatePresence>
        </>
    )
}

export default Payroll;
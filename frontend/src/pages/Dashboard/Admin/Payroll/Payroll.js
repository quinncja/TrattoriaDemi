import { getPayrollByPeriod, savePayroll } from "api";
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useReactToPrint } from "react-to-print";
import PayrollPdf from "./PayrollPdf";
import PayrollHeader from "./PayrollHeader";
import PayrollEditor from "./PayrollEditor";
import { fadeIn, loadingAnimation } from "animations";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { getCurrentPeriod } from "functions";
import BackContext from "context/BackContext";

function Payroll() {
  const [searchParams] = useSearchParams();
  const { setter } = useContext(BackContext);
  const period = searchParams.get("period") || "";
  const [payrollData, setPayrollData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [editing, setEditing] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(Number(period));
  const payrollRowRefs = useRef([]);
  const componentRef = useRef();

  useEffect(() => {
    if (!period) setCurrentPeriod(getCurrentPeriod());
  }, [period]);

  useEffect(() => {
    setter([
      {
        body: "body",
        tag: "payroll",
      },
      {
        body: "period",
        tag: "",
      },
    ]);
  }, [setter]);

  useEffect(() => {
    const loadPayroll = async () => {
      setPayrollData();
      const payrollData = await getPayrollByPeriod(period);
      if (payrollData.total) setEditing(false);
      else setEditing(true);
      payrollRowRefs.current = payrollData.payments.map(() =>
        React.createRef()
      );
      setPayrollData(payrollData);
    };
    if (period) loadPayroll();
  }, [period]);

  const handleEdit = () => {
    setEditing(!editing);
  };
  const handleEditedData = (newData) => {
    setPayrollData(newData);
  };

  const handleSave = async () => {
    try {
      const returnPayroll = await savePayroll(newData);
      setPayrollData(returnPayroll);
    } catch (error) {
      console.log(error);
      return;
    }
    setEditing(false);
  };

  const handlePrint = () => {
    print();
  };

  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  const sortPayroll = (payrollData) => {
    if (payrollData?.payments) {
      payrollData.payments.sort((a, b) => {
        const lastNameA = a.employee.name.split(" ").pop().toLowerCase();
        const lastNameB = b.employee.name.split(" ").pop().toLowerCase();

        if (lastNameA > lastNameB) return 1;
        if (lastNameA < lastNameB) return -1;
        return 0;
      });

      return payrollData;
    }
  };
  return (
    <>
      <PayrollHeader
        editing={editing}
        isNew={!payrollData?.total}
        handleEditedData={handleEditedData}
        handleEdit={handleEdit}
        handleClick={handleSave}
        handlePrint={handlePrint}
        currentPeriod={period}
      />
      <AnimatePresence>
        {payrollData ? (
          editing ? (
            <PayrollEditor
              payrollData={sortPayroll(payrollData)}
              currentPeriod={currentPeriod}
              setNewData={setNewData}
            />
          ) : (
            <motion.div {...fadeIn} className="saved-payroll">
              <PayrollPdf
                payrollData={sortPayroll(payrollData)}
                currentPeriod={period}
                ref={componentRef}
              />
            </motion.div>
          )
        ) : (
          loadingAnimation()
        )}
      </AnimatePresence>
    </>
  );
}

export default Payroll;

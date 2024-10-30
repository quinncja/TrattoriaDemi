import React from "react";
import { useSearchParams } from "react-router-dom";
import PayrollDash from "./Payroll/PayrollDash";
import "./Admin.css";
import Employees from "./Employee/Employees";
import Payroll from "./Payroll/Payroll";
import AdminDashboard from "./AdminDashboard";

function DBAdmin() {
  const [searchParams] = useSearchParams();
  const body = searchParams.get("body") || "";

  const renderBody = () => {
    switch (body) {
      case "payroll":
        return <PayrollDash />;
      case "payroll-editor":
        return <Payroll />;
      case "employees":
        return <Employees />;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="dbadmin">{body ? renderBody() : <AdminDashboard />}</div>
    </>
  );
}

export default DBAdmin;

import React from "react";
import { useSearchParams } from "react-router-dom";
import AdminNav from "./AdminNav";
import Menu from "./Menu";
import Payroll from "./Payroll";
import Home from "./Home";
import "./Admin.css"
import Employees from "./Employees";

function DBAdmin() {
  const [searchParams] = useSearchParams();
  const body = searchParams.get('body') || ""

  const renderBody = () => {
    switch(body) {
      case "home":
        return <Home />;
      case "menu":
        return <Menu />;
      case "payroll":
        return <Payroll />;
      case "employees":
        return <Employees/>;
      default:
        return "";
    }
  };

  return(
    <> 
      <div className="dbadmin"> 
        {body ? renderBody() : <AdminNav/>}
      </div>
    </>
  );
}

export default DBAdmin;

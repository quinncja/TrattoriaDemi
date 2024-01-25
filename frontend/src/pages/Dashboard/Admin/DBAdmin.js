import React from "react";
import { useSearchParams } from "react-router-dom";
import AdminNav from "./AdminNav";
import Menu from "./Menu";
import Payroll from "./Payroll";
import Home from "./Home";
import "./Admin.css"

function DBAdmin() {
  const [searchParams] = useSearchParams();
  const body = searchParams.get('body') || "home"

  const renderBody = () => {
    switch(body) {
      case "home":
        return <Home />;
      case "menu":
        return <Menu />;
      case "payroll":
        return <Payroll />;
      default:
        return <Home />;
    }
  };

  return(
    <> 
      <div className="dbadmin"> 
      <AdminNav/>
        {renderBody()}
      </div>
    </>
  );
}

export default DBAdmin;

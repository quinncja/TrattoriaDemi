import React from "react";
import "./DashboardNav.css";
import { useSearchParams } from "react-router-dom";

function DashboardNav(props) {

  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = props.currentView;
  const authenticated = props.authenticated;

  return (
    <div className="dashboard-navbar-wrapper">
      <div className="dashboard-navbar">
        <div className="dbn-name">Trattoria Demi Dashboard</div>
        <div className="dbn-buttons">
          <button
            className={`dbn-button ${
              currentView === "inhouse" && "dbn-button-active"
            } ${!authenticated && "invisible"}`}
            onClick={() => {  
              setSearchParams({})
              searchParams.delete("body")
              searchParams.set("view", "inhouse")
              setSearchParams(searchParams)
            }}
          >
            In house
          </button>
          <button
            className={`dbn-button ${
              currentView === "admin" && "dbn-button-active"
            } ${!authenticated && "invisible"}`}
            onClick={() =>  {     
              searchParams.delete("body")
              searchParams.set("view", "admin")
              setSearchParams(searchParams)
            }}
            >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;

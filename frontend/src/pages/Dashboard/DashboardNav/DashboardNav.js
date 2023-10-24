import React from "react";
import "./DashboardNav.css";
function DashboardNav(props) {
  const setView = props.setView;
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
            onClick={() => setView("inhouse")}
          >
            In house
          </button>
          <button
            className={`dbn-button ${
              currentView === "admin" && "dbn-button-active"
            } ${!authenticated && "invisible"}`}
            onClick={() => setView("admin")}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;

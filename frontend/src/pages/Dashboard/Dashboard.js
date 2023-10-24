import React, { useEffect, useState } from "react";
import DashboardNav from "./DashboardNav/DashboardNav";
import DBAdmin from "./DBAdmin";
import DBInhouse from "./DBInhouse/DBInhouse";
import DBLogin from "./DBLogin.js";
import Userfront from "@userfront/react";

import "./Dashboard.css"
function Dashboard() {
  const [view, setView] = useState("inhouse");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(Userfront.user)
  },[])
  
  return (
    <>
      <DashboardNav setView={setView} currentView={view} authenticated={authenticated}/>
        <div className="db-background">
          {!authenticated ? 
            <DBLogin setAuthenticated={setAuthenticated} />
           : (
            (view === "admin" && <DBAdmin />) ||
            (view === "inhouse" && <DBInhouse />)
          )}
        </div>
    </>
  );
}

export default Dashboard;

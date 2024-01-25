import React, { useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";
import DashboardNav from "./DashboardNav/DashboardNav";
import DBAdmin from "./Admin/DBAdmin";
import DBInhouse from "./InHouse/DBInhouse";
import DBLogin from "./DBLogin.js";
import Userfront from "@userfront/core";

import "./Dashboard.css";
function Dashboard() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || "inhouse"

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (Userfront.tokens.accessToken) setAuthenticated(true);
  }, []);

  return (
    <>
      <DashboardNav
        currentView={view}
        authenticated={authenticated}
      />
      <div className="db-background">
        {!authenticated ? (
          <DBLogin setAuthenticated={setAuthenticated} />
        ) : (
          (view === "admin" && <DBAdmin />) ||
          (view === "inhouse" && <DBInhouse />)
        )}
      </div>
    </>
  );
}

export default Dashboard;

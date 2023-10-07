import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/App.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="app">
      {window.location.pathname !== "/dashboard" && <Navbar />}
      <Outlet />
      {window.location.pathname !== "/dashboard" && <Footer />}
    </div>
  );
}

export default App;

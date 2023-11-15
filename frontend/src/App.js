import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/App.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useMenu } from "./context/MenuContext";

function App() {
  const location = useLocation();
  const { getMenu } = useMenu();

  useEffect(() => {
    const isOrderPath =
      location.pathname === "/order" ||
      location.pathname.startsWith("/order?item=");

    if (!isOrderPath) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    getMenu();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      {window.location.pathname !== "/dashboard" && <Navbar />}
      <Outlet />
      {window.location.pathname !== "/dashboard" && <Footer />}
    </div>
  );
}

export default App;

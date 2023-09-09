import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../images/TrattoriaDemiCenteredWhite.png";
import { useMobile } from "../context/MobileContext";

export function Navbar() {
  const mobile = useMobile();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);
  let loc = location.pathname.substring(1);

  useEffect(() => {
    if (loc === "checkout") loc = "order";
    if (loc === "") loc = "home"; 
    if (loc === "dashboard") loc = "home";
    if (loc === "giftcards/") loc = "giftcards"; 
    changeActive(loc);
  }, [loc, mobile]);
  
  useEffect(() => {
    window.scrollTo(0,0)
  },[])

  const changeActive = (newLoc) => {
    if (currentPage)
      document.getElementById(currentPage).className = "navbar-link";

    if (newLoc === "home") return;

    document.getElementById(newLoc).className =
      "navbar-link navbar-link-active";
    setCurrentPage(newLoc);
  };

  const navHome = () => {
    navigate("/home");
  };

  const clickHandler = (event) => {
    if (mobile) setShowNav(false);
    changeActive(event.currentTarget.id);
    navigate("/" + event.currentTarget.id);
  };

  if (mobile) {
    return (
      <div className="navbar navbar-mobile">
        <img
          className="navbar-logo-mobile"
          onClick={navHome}
          src={Logo}
          alt="Trattoria Demi"
        />
        <button
          type="button"
          className="hamburger-button"
          onClick={() => setShowNav(!showNav)}
        >
          <div className={`hamburger-line ${showNav && "ham-line-1"}`} />
          <div className={`hamburger-line ${showNav && "ham-line-2"}`} />
          <div className={`hamburger-line ${showNav && "ham-line-3"}`} />
        </button>

        <div className={`mobile-nav ${showNav && "mobile-nav-active"}`}>
          <div id="menu" className="navbar-link" onClick={clickHandler}>
            Menu
          </div>
          <div id="reserve" className="navbar-link" onClick={clickHandler}>
            Reserve
          </div>
          <div id="contact" className="navbar-link" onClick={clickHandler}>
            Contact
          </div>
          <div id="gallery" className="navbar-link" onClick={clickHandler}>
            Gallery
          </div>
          <div id="giftcards" className="navbar-link" onClick={clickHandler}>
            Gift Cards
          </div>
          <div id="order" className="navbar-link" onClick={clickHandler}>
            Order
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="navbar">
        <div className="navbar-links">
          <div id="menu" className="navbar-link" onClick={clickHandler}>
            Menu
          </div>
          <div id="reserve" className="navbar-link" onClick={clickHandler}>
            Reserve
          </div>
          <div id="contact" className="navbar-link" onClick={clickHandler}>
            Contact
          </div>
          <img
            className="navbar-logo"
            onClick={navHome}
            src={Logo}
            alt="Trattoria Demi"
          />
          <div id="gallery" className="navbar-link" onClick={clickHandler}>
            Gallery
          </div>
          <div id="giftcards" className="navbar-link" onClick={clickHandler}>
            Gift Cards
          </div>
          <div id="order" className="navbar-link" onClick={clickHandler}>
            Order
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;

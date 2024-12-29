import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../images/TrattoriaDemiCenteredWhite.png";
import { useMobile } from "../context/MobileContext";

export function Navbar() {
  const { mobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");
  const [showNav, setShowNav] = useState(false);

  const determineLocation = useCallback((path) => {
    let loc = path.substring(1);
    if (loc === "checkout") loc = "order";
    if (loc === "") loc = "home";
    if (loc === "dashboard") loc = "home";
    if (loc === "giftcards/") loc = "giftcards";
    if (loc === "email") loc = "home";
    if (loc === "signout") loc = "home";
    if (loc.match(/^order-status\/.*/)) loc = "home";
    if (loc.match(/^cancel\/.*/)) loc = "home";
    return loc;
  }, []);

  useEffect(() => {
    const loc = determineLocation(location.pathname);
    setCurrentPage(loc);
  }, [location.pathname, determineLocation]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navHome = () => {
    navigate("/home");
  };

  const clickHandler = (event) => {
    const newPage = event.currentTarget.id;
    if (mobile) setShowNav(false);
    setCurrentPage(newPage);
    navigate("/" + newPage);
  };

  const renderNavLinks = (links) => {
    return links.map((link) => (
      <div
        key={link}
        id={link}
        className={`navbar-link ${
          currentPage === link ? "navbar-link-active" : ""
        }`}
        onClick={clickHandler}
      >
        {link.charAt(0).toUpperCase() + link.slice(1)}
      </div>
    ));
  };

  const navLinks = [
    "menu",
    "reserve",
    "contact",
    "order",
    "deals",
    "gallery",
    "giftcards",
    "FAQ",
  ];
  const firstThreeLinks = navLinks.slice(0, 4);
  const remainingLinks = navLinks.slice(4);

  return mobile ? (
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
        {renderNavLinks(navLinks)}
      </div>
    </div>
  ) : (
    <div className="navbar">
      <div className="navbar-links">
        {renderNavLinks(firstThreeLinks)}
        <img
          className="navbar-logo"
          onClick={navHome}
          src={Logo}
          alt="Trattoria Demi"
        />
        {renderNavLinks(remainingLinks)}
      </div>
    </div>
  );
}

export default Navbar;

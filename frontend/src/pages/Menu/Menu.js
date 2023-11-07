import React, { useEffect, useState } from "react";
import { lunchMenu, dinnerMenu, wineList } from "./MenuList.js";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useMobile } from "../../context/MobileContext.js";
import { motion } from "framer-motion"
import { fadeInMany } from "../../animations";
import FancyLine from "../../images/FancyLine.png";
import "./Menu.css";
export default function Menu() {
  const [currentMenu, setCurrent] = useState("");
  const mobile = useMobile();

  useEffect(() => {
    let current = window.sessionStorage.getItem("currentMenu");
    if (current !== null) setCurrent(current);
    else setCurrent("Full");
  }, []);

  useEffect(() => {
    if (currentMenu !== "")
      document.getElementById(currentMenu).className =
        "menu-selector menu-selector-active";
    if (currentMenu === "Lunch")
      document.getElementById("lunch-group").className =
        "lunch-group lunch-group-active";
  });

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  function setMenu(id) {
    scrollToTop();
    if (id !== currentMenu) {
      const oldMenu = Array.from(
        document.getElementsByClassName("menu-selector menu-selector-active")
      );
      oldMenu[0].className = "menu-selector";
    }
    if (id === "Lunch")
      document.getElementById("lunch-group").className =
        "lunch-group lunch-group-active";
    else document.getElementById("lunch-group").className = "lunch-group";

    window.sessionStorage.setItem("currentMenu", id);
    setCurrent(id);
  }

  function displayMenu(list) {
    return (
      <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 750: 2 }}>
        <Masonry gutter="45px">
          {list.sections.map((section, index) => (
            <motion.div               
            initial="hidden"
            animate="visible"
            variants={fadeInMany}
            custom={index}
            className="menu-section" key={index}>
              <div className="menu-section-header">{section.header}</div>
              <img className="fancy-line" src={FancyLine} alt="" />
              <div className="item-group-container">
                {section.items.map((item, index) => (
                  <div className="item-group" key={index}>
                    <div className="menu-item">
                      {item.name ? item.name : item}
                    </div>
                    {item.description && (
                      <div className="menu-item-desc">{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    );
  }

  function renderSwitch() {
    switch (currentMenu) {
      default:
        return displayMenu(dinnerMenu);
      case "Full":
        return displayMenu(dinnerMenu);
      case "Lunch":
        return displayMenu(lunchMenu);
      case "Wine":
        return displayMenu(wineList);
    }
  }

  function menuTopbar() {
    return (
      <div className={`menu-top`}>
        <div className="menu-selectors">
          <div
            className="menu-selector"
            id="Full"
            onClick={() => setMenu("Full")}
          >
            {" "}
            Full Menu{" "}
          </div>
          <div
            className="menu-selector"
            id="Wine"
            onClick={() => setMenu("Wine")}
          >
            {" "}
            Wine List{" "}
          </div>
          <div className="lunch-groupings">
            <div
              className="menu-selector"
              id="Lunch"
              onClick={() => setMenu("Lunch")}
            >
              {" "}
              Lunch Specials{" "}
            </div>
            <div id="lunch-group" className="lunch-group">
              <div className="menu-selector special-text">
                (until 4pm daily)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {menuTopbar()}
      <div className={`menu-container ${mobile && "menu-container-mobile"}`}>
        <div className="menu-bottom">{renderSwitch()}</div>
      </div>
    </>
  );
}

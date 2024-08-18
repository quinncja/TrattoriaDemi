import React, { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useMobile } from "context/MobileContext.js";
import { useMenu } from "context/MenuContext";
import { motion } from "framer-motion";
import { fadeInMany } from "animations";
import FancyLine from "images/FancyLine.png";
import "./Menu.css";

export default function Menu() {
  const { menu } = useMenu();
  const [currentMenu, setCurrent] = useState("Full");
  const menuOptions = [
    { id: "Lunch", text: "Lunch Specials" },
    { id: "Full", text: "Full Menu" },
    { id: "Wine", text: "Wine List" },
  ];
  const mobile = useMobile();

  useEffect(() => {
    let current = window.sessionStorage.getItem("currentMenu");
    if (current !== null) {
      setMenu(current);
    } else {
      setMenu("Full");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  function setMenu(id) {
    scrollToTop();
    if (id !== currentMenu) {
      const oldMenu = Array.from(
        document.getElementsByClassName("menu-selector menu-selector-active")
      );
      if (oldMenu[0]) {
        oldMenu[0].className = "menu-selector";
      }
    }
    if (id !== "")
      document.getElementById(id).className =
        "menu-selector menu-selector-active";

    window.sessionStorage.setItem("currentMenu", id);
    setCurrent(id);
  }

  function formatPrice(price) {
    return price.toFixed(2);
  }

  function displayPrice(priceArray) {
    return priceArray.map(formatPrice).join(" - ");
  }

  function displayMenu(list) {
    return (
      <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 750: 2 }}>
        <Masonry gutter="45px">
          <div className="menu-text menu-hero-text">
            <div className="hero-text">
              {" "}
              {menuOptions
                ? menuOptions.find((option) => option.id === currentMenu).text
                : ""}{" "}
            </div>
            {currentMenu && currentMenu === "Lunch" && <p> Until 4pm daily</p>}
          </div>
          {list.sections.map((section, index) => (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInMany}
              custom={index}
              className="menu-section"
              key={index}
            >
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
                    {item.price && (
                      <div className="menu-item-price">
                        {" "}
                        {displayPrice(item.price)}{" "}
                      </div>
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
        return displayMenu(menu.dinner);
      case "Full":
        return displayMenu(menu.dinner);
      case "Lunch":
        return displayMenu(menu.lunch);
      case "Wine":
        return displayMenu(menu.wine);
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
          </div>
        </div>
      </div>
    );
  }

  function menuBottomBar() {
    const otherMenuOptions = menuOptions.filter(
      (option) => option.id !== currentMenu
    );

    return (
      <div className="menu-bottom-bar">
        <button className="subtle-button" onClick={() => scrollToTop()}>
          Return to Top
        </button>
        <button
          className="subtle-button"
          onClick={() => setMenu(otherMenuOptions[0].id)}
        >
          {otherMenuOptions[0].text}
        </button>
        <button
          className="subtle-button"
          onClick={() => setMenu(otherMenuOptions[1].id)}
        >
          {otherMenuOptions[1].text}
        </button>
      </div>
    );
  }

  return (
    <>
      {menuTopbar()}
      <div className={`menu-container ${mobile && "menu-container-mobile"}`}>
        {menu && <div className="menu-bottom">{renderSwitch()}</div>}
      </div>
      {menuBottomBar()}
    </>
  );
}

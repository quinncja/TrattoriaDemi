import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import Item from "./Item";
import "./Order.css";
import { useMobile } from "context/MobileContext";
import { useStatus } from "context/StatusContext";
import { useMenu } from "context/MenuContext";
import { statusAlert } from "swal2";
import { capitalizeFirstLetter } from "functions";
import { motion } from "framer-motion";
import { fadeInMany } from "animations";
import moment from "moment";

function Order() {
  const mobile = useMobile();
  const { menu } = useMenu();
  const { status } = useStatus();
  const [isLunch, setLunch] = useState(isBefore4PMChicago());
  function isBefore4PMChicago() {
    const chicagoTime = moment().tz("America/Chicago");
    const currentHour = chicagoTime.hours();
    return currentHour < 16;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLunch(isBefore4PMChicago());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status && !status.pickup && !status.delivery) statusAlert();
  }, [status]);

  const headers = [
    ...(isLunch ? ["LUNCH"] : []),
    "FOR THE TABLE",
    "SMALL PLATES",
    "SALADS",
    "PASTA",
    "PIZZA",
    "ENTRÉES",
    "SEAFOOD",
    "SIDES",
    "DESSERTS",
    "DRINKS",
    "BEER",
    "WINE",
  ];

  const handleOptionClick = (selectedId) => {
    if (!menu) return;
    const menuSection = document.getElementById(selectedId);
    if (menuSection) {
      const scrollOptions = {
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      };
      const offset = mobile ? 130 : 179;
      const scrollY =
        menuSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ ...scrollOptions, top: scrollY });
    }
  };

  function orderTopBar() {
    return (
      <div className="order-top">
        <div className="scroll-wrapper">
          <div className="order-selectors">
            {headers.map((section) => (
              <div
                className="order-selector"
                key={section + "display"}
                onClick={() => handleOptionClick(section)}
              >
                {" "}
                {capitalizeFirstLetter(section)}
              </div>
            ))}
          </div>
        </div>
        <div className="cart-section order-selector">
          <Cart />
        </div>
      </div>
    );
  }

  function displayItems(menu) {
    return (
      <>
        {menu.sections.map((section, index) => (
          <motion.div
            className="order-section"
            key={section.header}
            id={section.header}
            initial="hidden"
            animate="visible"
            variants={fadeInMany}
            custom={index}
          >
            <div className="order-section-header">
              {" "}
              {capitalizeFirstLetter(section.header)}{" "}
            </div>
            <div className="section-items">
              {section.items.map((item) => (
                <Item item={item} key={item._id} section={menu.menuType} />
              ))}
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  return (
    <div className="background-color">
      {orderTopBar()}

      {menu && (
        <div id="LUNCH" className="order-container">
          <div className="sub-menu-header"> Lunch Menu </div>
          <div className="sub-menu-container">{displayItems(menu.lunch)}</div>
        </div>
      )}

      {menu && (
        <div className="order-container">{displayItems(menu.dinner)}</div>
      )}

      {menu && (
        <div id="WINE" className="order-container order-container-sub">
          <div className="sub-menu-header"> Wine List </div>
          <div className="sub-menu-container">{displayItems(menu.wine)}</div>
        </div>
      )}
    </div>
  );
}

export default Order;

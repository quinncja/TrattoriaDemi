import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import Item from "./Item";
import "./Order.css";
import { useMobile } from "../../context/MobileContext";
import { checkForUpdate, getMenus } from "../../api";
import localForage from "localforage";
import { useStatus } from "../../context/StatusContext";
import { statusAlert } from "../../swal2";
import { capitalizeFirstLetter } from "../../functions";
import moment from "moment";

function Order() {
  const mobile = useMobile();
  const { status } = useStatus();
  const [lunchMenu, setLunchMenu] = useState(null);
  const [dinnerMenu, setDinnerMenu] = useState(null);
  const [wineList, setWineList] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const [isLunch, setLunch] = useState(isBefore4PMChicago())

  function isBefore4PMChicago() {
    const chicagoTime = moment().tz('America/Chicago');
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

  function handleResponseData(data) {
    setLunchMenu(data.lunch);
    setDinnerMenu(data.dinner);
    setWineList(data.wine);
    setLoaded(true);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const setMenuLocal = async (menus) => {
      try {
        await localForage.setItem("menus", menus);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchMenusFromServer = async () => {
      try {
        const response = await getMenus(signal);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMenusFromLocal = async () => {
      try {
        const menus = await localForage.getItem("menus");

        return menus;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    const checkLastUpdated = async () => {
      try {
        const lastUpdatedTimes = await checkForUpdate(signal);
        return lastUpdatedTimes;
      } catch (error) {
        console.log(error);
      }
    };

    function checkForUpdates(menus, times) {
      let upToDate = true;
      for (let menuType in times.data) {
        if (
          !menus[menuType] ||
          new Date(times[menuType]) > new Date(menus[menuType].lastUpdated)
        ) {
          upToDate = false;
        }
      }
      return upToDate ? menus : upToDate;
    }

    const getMenu = async () => {
      let menus = await fetchMenusFromLocal();

      if (menus) {
        handleResponseData(menus);

        let times = await checkLastUpdated();
        if(times){
          const upToDate = checkForUpdates(menus, times);
          if (!upToDate) {
            menus = await fetchMenusFromServer();
            if (menus){
              setMenuLocal(menus);
              handleResponseData(menus);
            }
          }
        }
      } else {
        menus = await fetchMenusFromServer();
          if (menus){
            setMenuLocal(menus);
            handleResponseData(menus);
        }
      }
    };

    getMenu();

  return () => {
    abortController.abort();
  };

  }, []);

  const handleOptionClick = (selectedId) => {
    if (!loaded) return;
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
        {menu.sections.map((section) => (
          <div
            className="order-section"
            key={section.header}
            id={section.header}
          >
            <div className="order-section-header">
              {" "}
              {capitalizeFirstLetter(section.header)}{" "}
            </div>
            <div className="section-items">
              {section.items.map((item) => (
                <Item item={item} key={item._id} />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="background-color">
      {orderTopBar()}

      {loaded && isLunch && (
        <div id="LUNCH" className="order-container">
          <div className="sub-menu-header"> Lunch Menu </div>
          <div className="sub-menu-container">{displayItems(lunchMenu)}</div>
        </div>
      )}

      {loaded && (
        <div className="order-container">{displayItems(dinnerMenu)}</div>
      )}

      {loaded && (
        <div id="WINE" className="order-container order-container-sub">
          <div className="sub-menu-header"> Wine List </div>
          <div className="sub-menu-container">{displayItems(wineList)}</div>
        </div>
      )}
    </div>
  );
}

export default Order;

import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import Item from "./Item";
import "./Order.css";
import { useMobile } from "../../context/MobileContext";
import { checkForUpdate, getMenus } from "../../api";
import localForage from 'localforage';

function Order() {
  const mobile = useMobile();
  const [lunchMenu, setLunchMenu] = useState(null);
  const [dinnerMenu, setDinnerMenu] = useState(null);
  const [wineList, setWineList] = useState(null);
  const [loaded, setLoaded] = useState(null);

  const headers = [
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
    "LUNCH",
  ]

  function handleResponseData(data) {
    setLunchMenu(data.lunch);
    setDinnerMenu(data.dinner);
    setWineList(data.wine);
    setLoaded(true);
  }

  useEffect(() => {
    const setMenuLocal = async (menus) => {
      try {
        await localForage.setItem("menus", menus);
      }
        catch(error) {
          console.log(error)
        }
    }
    const fetchMenusFromServer = async () => {
      try {
        const response = await getMenus();
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMenusFromLocal = async () => {
      try {
        const menus =  await localForage.getItem("menus");

        return menus;
      }
        catch(error) {
          console.log(error)
          return (null)
        }
    };

    const checkLastUpdated = async () => {
      try {
         const lastUpdatedTimes = await checkForUpdate();
         return lastUpdatedTimes;
      } catch (error){
        console.log(error)
      }
    }
    
    function checkForUpdates(menus, times){
      let needToUpdate = false;
      for (let menuType in times) {
        if (!menus[menuType] || new Date(times[menuType]) > new Date(menus[menuType].lastUpdated)) {
            needToUpdate = true;
        } 
      }
      return(needToUpdate || menus)
    }

    const getMenu = async () => {
      let menus = await fetchMenusFromLocal();
  
      if (menus) {
        handleResponseData(menus); // Show the local menus to the user first
  
        // Now check for updates in the background
        let times = await checkLastUpdated();
        const updatesNeeded = checkForUpdates(menus, times);
        if (updatesNeeded) {
          menus = await fetchMenusFromServer();
          setMenuLocal(menus);
          handleResponseData(menus); // Optional: Update the UI with new data or notify the user
        }
      } else {
        menus = await fetchMenusFromServer();
        setMenuLocal(menus);
        handleResponseData(menus);
      }
    }

    getMenu();
  }, []);

  const handleOptionClick = (selectedId) => {
    if(!loaded) return;
    const menuSection = document.getElementById(selectedId);
    if (menuSection) {
      const scrollOptions = {
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      };
      const offset = mobile ? 130 : 179; // To adjust for header offset
      const scrollY =
        menuSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ ...scrollOptions, top: scrollY });
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0) + string.slice(1).toLowerCase();
  }

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
      {loaded && <div className="order-container">{displayItems(dinnerMenu)}</div>}

      {loaded &&
      <div id="WINE" className="order-container order-container-sub">
        <div className="sub-menu-header"> Wine List </div>
       <div className="sub-menu-container">{displayItems(wineList)}</div>
      </div>}

      {loaded && 
      <div id="LUNCH" className="order-container order-container-sub">
        <div className="sub-menu-header"> Lunch Menu </div>
        <div className="sub-menu-container">{displayItems(lunchMenu)}</div>
      </div> }

    </div>
  );
}

export default Order;

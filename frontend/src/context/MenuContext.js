import { createContext, useContext, useState } from "react";
import { checkForUpdate, getMenus } from "./../api";
import localForage from "localforage";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(null);

  const abortController = new AbortController();
  const signal = abortController.signal;

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
      console.log(lastUpdatedTimes);
      return lastUpdatedTimes;
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

  const setMenuLocal = async (menus) => {
    try {
      await localForage.setItem("menus", menus);
    } catch (error) {
      console.log(error);
    }
  };

  function checkForUpdates(menus, times) {
    let upToDate = true;
    for (let menuType in times) {
      if (
        !menus[menuType] ||
        new Date(times[menuType]) > new Date(menus[menuType].lastUpdated)
      ) {
        upToDate = false;
      }
    }
    console.log(upToDate);
    return upToDate ? menus : upToDate;
  }

  const getMenu = async () => {
    let menus = await fetchMenusFromLocal();

    if (menus) {
      setMenu(menus);

      let times = await checkLastUpdated();
      if (times) {
        const upToDate = checkForUpdates(menus, times);
        if (!upToDate) {
          menus = await fetchMenusFromServer();
          if (menus) {
            setMenuLocal(menus);
            setMenu(menus);
          }
        }
      }
    } else {
      menus = await fetchMenusFromServer();
      if (menus) {
        setMenuLocal(menus);
        setMenu(menus);
      }
    }
  };

  return (
    <MenuContext.Provider value={{ menu, getMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  return useContext(MenuContext);
};

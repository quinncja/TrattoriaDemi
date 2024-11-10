import React, { createContext, useContext, useState, useEffect } from "react";

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [mobile, setMobile] = useState(window.innerWidth <= 1000);
  const [phone, setPhone] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 1000);
      setPhone(window.innerWidth <= 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={{mobile, phone}}>{children}</MobileContext.Provider>
  );
};

export const useMobile = () => {
  return useContext(MobileContext);
};

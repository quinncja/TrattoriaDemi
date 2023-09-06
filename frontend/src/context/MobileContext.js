import React, { createContext, useContext, useState, useEffect } from "react";

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [mobile, setMobile] = useState(window.innerWidth <= 1000);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={mobile}>{children}</MobileContext.Provider>
  );
};

export const useMobile = () => {
  return useContext(MobileContext);
};

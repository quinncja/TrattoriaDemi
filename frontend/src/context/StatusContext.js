import React, { createContext, useContext, useState, useEffect } from "react";
import { getSystemStatus } from "../api";

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [status, setStatus] = useState({
    delivery: true,
    pickup: true,
  });
  const [updated, setUpdated] = useState(false);

  async function checkForStatusUpdate() {
    try {
      const data = await getSystemStatus();
      if (data) {
        setStatus(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchStatus() {
      const data = await getSystemStatus();
      if (data) {
        setStatus(data);
        setUpdated(true);
      }
    }
    fetchStatus();
  }, []);

  return (
    <StatusContext.Provider value={{ status, updated, checkForStatusUpdate }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  return useContext(StatusContext);
};

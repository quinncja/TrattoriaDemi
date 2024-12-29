import { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_URL;

function ReservationSSE() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const endpoint = `${API_URL}api/reservations/events`;

  useEffect(() => {
    let eventSource;
    let reconnectInterval = 5000;
    let reconnectTimer;

    const connect = () => {
      eventSource = new EventSource(endpoint);

      eventSource.onopen = () => {
        console.log("EventSource connection opened.");

        reconnectInterval = 5000;
      };

      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
        setError(null);
      };

      eventSource.onerror = (err) => {
        console.error(
          "EventSource encountered an error:",
          err,
          "Ready state:",
          eventSource.readyState
        );

        eventSource.close();

        reconnectTimer = setTimeout(() => {
          console.log("Attempting to reconnect to EventSource...");
          connect();
        }, reconnectInterval);

        reconnectInterval = Math.min(reconnectInterval * 2, 60000);

        setError(err);
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [endpoint]);

  return { data, error };
}

export default ReservationSSE;

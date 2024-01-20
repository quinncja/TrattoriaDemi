import { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_LOCAL_BACKEND;

function ReservationSSE() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const endpoint = `${API_URL}api/reservations/events`;

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    eventSource.onerror = (err) => {
      console.error(
        "EventSource failed:",
        err,
        "Ready state:",
        eventSource.readyState
      );
      eventSource.close();
      setError(err);
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return { data, error };
}

export default ReservationSSE;

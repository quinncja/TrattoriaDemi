import React, { useEffect, useState } from "react";
import OrderHeader from "./OrderHeader";
import OrderDisplayer from "./OrderDisplayer";
import { getOrders, markComplete, patchOrderConfirm } from "../../../api";
import OrderSSE from "./OrderSSE";
import { deleteOrder } from "../../../api";

function Orders() {
  const [state, setState] = useState(true);
  const [orders, setOrders] = useState([]);
  const [completeOrders, setCompletedOrders] = useState([]);
  const { data: order } = OrderSSE();

  useEffect(() => {
    if (order) {
      setOrders((preOrders) => [...preOrders, order]);
      setCompletedOrders();
    }
  }, [order]);

  async function loadOrders(signal) {
    try {
      const response = await getOrders(signal);
      const completedOrdersList = response.filter(
        (order) => order.status === "completed"
      );
      const nonCompletedOrdersList = response.filter(
        (order) => order.status !== "completed"
      );

      setOrders(nonCompletedOrdersList);
      setCompletedOrders(completedOrdersList);
    } catch (error) {
      console.log(error);
    }
  }

  async function completeOrder(order) {
    try {
      const updatedOrder = await markComplete(order._id);
      setOrders((prevOrders) => [
        ...prevOrders.filter((prevOrder) => prevOrder._id !== order._id),
      ]);
      setCompletedOrders((prevComp) => [...prevComp, updatedOrder]);
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmOrder(id, readyAtTime) {
    try {
      const response = await patchOrderConfirm(id, readyAtTime);
      if (response) {
        setOrders((prevOrders) => [
          ...prevOrders.filter((prevOrder) => prevOrder._id !== id),
          response,
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelOrder(id) {
    try {
      await deleteOrder(id);
      setOrders((prevOrders) => [
        ...prevOrders.filter((prevOrder) => prevOrder._id !== id),
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    loadOrders(signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className={`orders-container order-container-state-${state}`}>
      <div className="res-container-inner">
        <div className="reservations-header">
          <div className="res-header">
            <OrderHeader state={state} setState={setState} />
          </div>
        </div>
        <div className="orders-hide-overflow">
          <OrderDisplayer orders={completeOrders} setState={setState} />
          <OrderDisplayer
            orders={orders}
            setState={setState}
            confirmOrder={confirmOrder}
            cancelOrder={cancelOrder}
            completeOrder={completeOrder}
          />
        </div>
      </div>
    </div>
  );
}

export default Orders;

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api";
import moment from "moment-timezone";
import FancyLine from "../../images/FancyLine.png";
import { orderSuccess } from "../../swal2";
import CartContext from "../../context/CartContext";
import { minutesUntilTime } from "../../functions";

function OrderStatus() {
  const param = useParams();
  const id = param["*"];
  const [order, setOrder] = useState(null);
  const [date, setDate] = useState(moment.tz("America/Chicago"));
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusValue = params.get("status");

    if (statusValue) {
      orderSuccess();
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(moment.tz("America/Chicago"));
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadOrder = async () => {
      try {
        const responseData = await getOrderById(id, signal);
        setOrder(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    loadOrder();

    return () => {
      abortController.abort();
    };
  }, [id]);

  function displayModifiers(modifiers) {
    let optionArr = [];
    if (modifiers.size) {
      optionArr.push(modifiers.size.name);
    }
    if (modifiers.sauce) {
      optionArr.push(modifiers.sauce.name);
    }
    if (modifiers.pasta) {
      optionArr.push("Sub " + modifiers.pasta.name);
    }
    if (modifiers.options) {
      for (let i = 0; i < modifiers.options.length; i++)
        optionArr.push(modifiers.options[i].name);
    }
    if (modifiers.dressing) {
      optionArr.push(`extra dressing (${modifiers.dressing})`);
    }
    if (modifiers.platter) {
      for (let i = 0; i < modifiers.platter.length; i++)
        optionArr.push(modifiers.platter[i].name);
    }
    return optionArr.join(", ");
  }

  function CheckoutItem(props) {
    const item = props.item;
    return (
      <div className="checkout-item">
        <div className="checkout-item-left">
          <div className="checkout-item-header">
            <div className="row">
              <div className="checkout-item-qty">{item.qty}</div>
              <div className="checkout-item">{item.name}</div>
            </div>
            <div className="item-price">{item.totalPrice}</div>
          </div>
          <div className="item-options">{displayModifiers(item.modifiers)}</div>
          {item.instructions && (
            <div className="item-options">{item.instructions}</div>
          )}
        </div>
      </div>
    );
  }

  function getStatusText() {
    console.log(order);
    if (order.status === "waiting") {
      return <div className="order-status-header"> Awaiting confirmation </div>;
    } else
      return (
        <div>
          <div className="order-status-header"> Confirmed! </div>
          {order.type === "pickup" && (
            <div className="order-status-subheader">
              {" "}
              Pickup in {minutesUntilTime(date, order.estimatedReady)} minutes
            </div>
          )}
          {order.type === "delivery" && (
            <div className="order-status-subheader">
              {" "}
              Delivery expected in{" "}
              {minutesUntilTime(date, order.estimatedReady)} minutes
            </div>
          )}
        </div>
      );
  }

  if (!order) return <div className="empty" />;
  return (
    <div className="reserve-container cancel-container">
      <div className="reserve-section reserve-section-cancel rs-os">
        <div className="menu-section-header">Order Status</div>
        <img className="fancy-line" src={FancyLine} alt="" />

        <div className="res-to-cancel">
          <div className="order-status">{getStatusText()}</div>

          <div className="order-items">
            {order.type === "delivery" && (
              <div className="address-info">
                <div className="checkout-item-name item-name"> Address </div>
                <div className="item-options"> {order.address} </div>
                <div className="item-options"> {order.notes} </div>
              </div>
            )}
            <div className="checkout-item-name item-name"> Your order </div>
            {order.items.map((item) => (
              <CheckoutItem item={item} />
            ))}
            <div className="checkout-item item-total">
              <div className="checkout-item-name item-name"> Total </div>
              <div className="item-price"> ${order.totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;

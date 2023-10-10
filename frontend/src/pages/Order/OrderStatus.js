import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api";
import FancyLine from "../../images/FancyLine.png";


function OrderStatus() {
  const param = useParams();
  const id = param["*"];
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const responseData = await getOrderById(id);
        setOrder(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    loadOrder();
  }, [id]);

  function displayModifiers(modifiers) {
    const optionArr = [];
    if (modifiers.size) {
      optionArr.push(modifiers.size);
    }
    if (modifiers.sauce) {
      optionArr.push(modifiers.sauce);
    }
    if (modifiers.pasta) {
      optionArr.push("Sub " + modifiers.pasta);
    }
    if (modifiers.options) {
      for (let i = 0; i < modifiers.options.length; i++)
        optionArr.push(modifiers.options[i]);
    }
    if (modifiers.dressing) {
      optionArr.push(`extra dressing (${modifiers.dressingQty})`);
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
            <div className="item-options">
              {displayModifiers(item.modifiers)}
            </div>
            {item.instructions && (
              <div className="item-options">{item.instructions}</div>
            )}
          </div>
        </div>
      );
  }

  function getStatusText(){
    console.log(order)
    if(order.estimatedReady === ""){
      return(<div className="order-status-header"> Awaiting confirmation </div>)
    }
    else return(
      <div> 
    <div className="order-status-header"> Confirmed! </div>
      {order.type === "pickup" && <div className="order-status-subheader"> Pickup in {order.estimatedReady} minutes</div>}
      {order.type === "delivery" && <div className="order-status-subheader"> Expected a delivery in {order.estimatedReady} minutes</div>}
      </div>
      )
  }

  if (!order) return <div className="empty" />;
  return (
    <div className="reserve-container">
      <div className="reserve-section reserve-section-cancel">
        <div className="menu-section-header">Order Status</div>
        <img
                className="fancy-line"
                src={FancyLine}
                alt=""
              />

              <div className="res-to-cancel">
                <div className="order-status">
                  {getStatusText()}
                </div>
                
                <div className="order-items">
                  {order.type === "delivery" &&
                  <div className="address-info"> 
                    <div className="checkout-item-name item-name">  Address </div>
                    <div className="item-options"> {order.address} </div>
                    <div className="item-options"> {order.notes} </div>
                  </div>
                  }
                <div className="checkout-item-name item-name">  Your order </div>
                {order.items.map((item) => (
                  <CheckoutItem item={item} />
                ))}
                <div className="checkout-item item-total"> 
                  <div className="checkout-item-name item-name"> total </div>
                  <div className="item-price"> ${order.totalPrice}</div>
                  </div>
              </div>
    
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;

import { useContext } from "react";
import {checkoutCart } from "../../api"
import CartContext from "../../context/CartContext";
import "./Order.css";

function Checkout() {
  const { items, price, deleteItemFromCart } = useContext(CartContext);

  async function submitCheckout(){
    const serverItemsList = items.map(item => item.serverItem);
    try {
      const response = await checkoutCart(serverItemsList);
      console.log(response)
    } catch (error ){

    }
  }

  function displayModifiers(modifiers) {
    console.log(modifiers)
    const optionArr = [];
    if (modifiers.size) {
      optionArr.push(modifiers.size);
    }
    if (modifiers.sauce) {
      optionArr.push(modifiers.sauce);
    }
    if (modifiers.pasta) {
      optionArr.push('Sub ' + modifiers.pasta);
    }
    if (modifiers.options) {
      for(let i = 0; i < modifiers.options.length; i++)
        optionArr.push(modifiers.options[i]);
    }
    if (modifiers.dressing) {
      optionArr.push(`extra dressing (${modifiers.dressingQty})`);
    }
    return optionArr.join(", ");
  }

  function checkoutItem(item) {
    return (
      <div className="checkout-item">
        <div className="checkout-item-left">
          <div className="checkout-item-header">
            <div className="row">
              <div className="checkout-item-qty">{item.qty}</div>
              <div className="checkout-item-name item-name">{item.name}</div>
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
        <div>
          <button
            className="delete-btn"
            onClick={() => deleteItemFromCart(item)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H5H21"
                stroke="#a9927d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                stroke="#a9927d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 11V17"
                stroke="#a9927d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V17"
                stroke="#a9927d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <div className="fancy-text ft-small"> Contact Information</div>
        <div className="checkout-inputs">
          <input className="checkout-input" placeholder="Name" />
          <input className="checkout-input" placeholder="Phone Number" />
          <button className="submit-button" onClick={() => submitCheckout()}> Checkout </button>
        </div>
      </div>

      <div className="checkout-right">
        <div className="fancy-text ft-small"> Your Order</div>
        <div className="checkout-items">
          {items.map((item) => checkoutItem(item))}
        </div>
        <div className="checkout-prices">
          <div className="checkout-price">
            <div>subtotal</div>
            <div>{price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

import { useContext } from "react";
import CartContext from "../../context/CartContext";
import "./Order.css";

function Checkout() {
  const { items, price, deleteItemFromCart } = useContext(CartContext);

  function displayPlatterSelection(selectedButtons) {
    const platterString = selectedButtons
      .map((button) => button.name)
      .join(", ");
    return platterString;
  }

  function displayOptions(options) {
    const optionArr = [];
    if (options?.selectedSize?.name) {
      optionArr.push(options.selectedSize.name);
    }
    if (options?.selectedSauce?.name) {
      optionArr.push(`${options.selectedSauce.name} sauce`);
    }
    if (options?.chicken) {
      optionArr.push("add chicken");
    }
    if (options?.wheat) {
      optionArr.push("sub wheat pasta");
    }
    if (options?.gf) {
      optionArr.push("sub gluten free pasta");
    }
    if (options?.dressing) {
      optionArr.push(`extra dressing (${options.dressingQty})`);
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
            {item.selectedButtons.length > 0 &&
              displayPlatterSelection(item.selectedButtons)}
            {displayOptions(item.options)}
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
